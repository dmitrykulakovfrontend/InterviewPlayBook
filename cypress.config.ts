import { defineConfig } from "cypress";
import prisma from "utils/prisma";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        userCleanup() {
          return new Promise(async (resolve) => {
            await prisma.user.delete({ where: { email: "test@example.com" } });
            resolve(true);
          });
        },
      });
    },
    baseUrl: "http://localhost:3000",
    projectId: "z75qdd",
  },
});

