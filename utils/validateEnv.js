export function validateEnv(vars) {
  vars.forEach((v) => {
    if (!process.env[v]) {
      throw new Error(`Missing required env var: ${v}`);
    }
  });
}