import { execSync } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

// type PlopAnswers = Parameters<PlopTypes.DynamicActionsFunction>[0] & {
//   type: "app" | "package";
//   appType?: "NextJs";
//   name: string;
// };

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType("installDependencies", async (answers) => {
    /**
     * Install deps and format everything
     */
    if (
      "name" in answers &&
      typeof answers.name === "string" &&
      "type" in answers &&
      typeof answers.type === "string"
    ) {
      execSync(`pnpm manypkg fix`, {
        stdio: "inherit",
      });
      execSync(`pnpm install --filter @acme/${answers.name}`);
      if ("appType" in answers && answers.appType === "NextJs") {
        execSync(
          `pnpm prettier --write ${answers.type}s/${answers.name}/src/** --list-different`,
        );
      }
      return "Package scaffolded";
    }
    return "Package not scaffolded";
  });

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
        choices: ["NextJs", "Astro"],
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
              { type: "installDependencies" },
            );
            return actions;
          }
          if (answers.appType === "Astro") {
            actions.push(
              {
                type: "addMany",
                destination: "apps/{{ name }}",
                base: "templates/astro",
                templateFiles: "templates/astro/**/*",
                globOptions: {
                  dot: true,
                },
              },
              { type: "installDependencies" },
            );
            return actions;
          }
        }
      }
      return actions;
    },
  });
}
