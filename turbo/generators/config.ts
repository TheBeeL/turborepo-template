import { execSync } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

type PackageJson = {
  dependencies?: Record<string, string>;
};

const genNextjsAction: PlopTypes.Actions = (answers) => {
  if (!answers) return [];
  const actions: PlopTypes.Actions = [];
  return actions;
};

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("new", {
    description: "Generate a new app or package for the Acme Monorepo",
    prompts: [
      {
        type: "list",
        name: "type",
        message: "What would you like to create? (app/package)",
        choices: ["app", "package"],
      },
      {
        when: (answers) => answers.type === "app",
        name: "appType",
        type: "list",
        message: "What type of app would you like to create?",
        choices: ["NextJs"],
      },
      {
        type: "input",
        name: "name",
        message: ({ type }) => `What is the name of the ${type}?`,
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.Actions = [];
      if (!answers) return actions;
      if ("type" in answers && typeof answers.type === "string") {
        if (answers.type === "package") {
          // TODO
          return [];
        } else if (answers.type === "app" && "appType" in answers) {
          if (answers.appType === "NextJs") {
            actions.push(
              {
                type: "addMany",
                destination: "apps/{{ name }}",
                base: "templates/nextjs",
                templateFiles: "templates/nextjs/**/*",
                globOptions: {
                  dot: true,
                },
              },
              async (answers) => {
                /**
                 * Install deps and format everything
                 */
                if ("name" in answers && typeof answers.name === "string") {
                  execSync(`pnpm manypkg fix`, {
                    stdio: "inherit",
                  });
                  execSync(
                    `pnpm prettier --write apps/${answers.name}/src/** --list-different`,
                  );
                  execSync(`pnpm install --filter @acme/${answers.name}`);
                  return "Package scaffolded";
                }
                return "Package not scaffolded";
              },
            );
          }
        }
      }
      return actions;
    },
  });
  plop.setGenerator("init", {
    description: "Generate a new package for the Acme Monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "What is the name of the package? (You can skip the `@acme/` prefix)",
      },
      {
        type: "input",
        name: "deps",
        message:
          "Enter a space separated list of dependencies you would like to install",
      },
    ],
    actions: [
      (answers) => {
        if ("name" in answers && typeof answers.name === "string") {
          if (answers.name.startsWith("@acme/")) {
            answers.name = answers.name.replace("@acme/", "");
          }
        }
        return "Config sanitized";
      },
      {
        type: "add",
        path: "packages/{{ name }}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/index.ts",
        template: "export * from './src';",
      },
      {
        type: "add",
        path: "packages/{{ name }}/src/index.ts",
        template: "export const name = '{{ name }}';",
      },
      {
        type: "modify",
        path: "packages/{{ name }}/package.json",
        async transform(content, answers) {
          if ("deps" in answers && typeof answers.deps === "string") {
            const pkg = JSON.parse(content) as PackageJson;
            for (const dep of answers.deps.split(" ").filter(Boolean)) {
              const version = await fetch(
                `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
              )
                .then((res) => res.json())
                .then((json) => json.latest);
              if (!pkg.dependencies) pkg.dependencies = {};
              pkg.dependencies[dep] = `^${version}`;
            }
            return JSON.stringify(pkg, null, 2);
          }
          return content;
        },
      },
      async (answers) => {
        /**
         * Install deps and format everything
         */
        execSync("pwd");
        if ("name" in answers && typeof answers.name === "string") {
          execSync("pnpm manypkg fix", {
            stdio: "inherit",
          });
          execSync(
            `pnpm prettier --write packages/${answers.name}/** --list-different`,
          );
          return "Package scaffolded";
        }
        return "Package not scaffolded";
      },
    ],
  });
}
