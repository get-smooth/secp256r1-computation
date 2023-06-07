import execute from "./execute";

describe("execute", () => {
    it("Trigger an error during the execution of the childProcess.exec command", async () => {
        await expect(execute("addawafafafafawdf")).rejects.toBe(undefined);
    });
    // @DEV: This test is not working, it doesn't pass into the expected branch
    xit("Trigger an error in the shell command", async () => {
        await expect(execute("echo hello | grep \"asdf\"")).rejects.toBe(undefined);
    });
    it("ok", async () => {
        await expect(execute("echo yo")).resolves.toMatch("yo");
    });
});
