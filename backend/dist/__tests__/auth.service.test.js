"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../modules/auth/auth.service");
const auth_repository_1 = require("../modules/auth/auth.repository");
jest.mock("../modules/auth/auth.repository", () => ({
    AuthRepository: {
        findByEmail: jest.fn(),
        createUser: jest.fn(),
        findById: jest.fn(),
        findByResetToken: jest.fn(),
        findAll: jest.fn(),
        updateUser: jest.fn(),
        setResetToken: jest.fn(),
        updatePasswordAndClearReset: jest.fn(),
        deleteUser: jest.fn(),
    },
}));
describe("AuthService password reset", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SMTP_HOST = "smtp.test.local";
        process.env.SMTP_PORT = "587";
        process.env.SMTP_USER = "test";
        process.env.SMTP_PASS = "secret";
        process.env.FRONTEND_URL = "http://localhost:3000";
    });
    it("sends a reset email and stores a hashed token when requested", async () => {
        const findByEmail = jest.mocked(auth_repository_1.AuthRepository.findByEmail);
        const setResetToken = jest.mocked(auth_repository_1.AuthRepository.setResetToken);
        findByEmail.mockResolvedValue({ _id: "user-1", email: "user@example.com" });
        const result = await auth_service_1.AuthService.requestPasswordReset({ email: "user@example.com" });
        expect(result.ok).toBe(true);
        expect(setResetToken).toHaveBeenCalledTimes(1);
        expect(setResetToken.mock.calls[0][0]).toBe("user-1");
        expect(setResetToken.mock.calls[0][1]).toMatch(/^[a-f0-9]{64}$/);
    });
});
//# sourceMappingURL=auth.service.test.js.map