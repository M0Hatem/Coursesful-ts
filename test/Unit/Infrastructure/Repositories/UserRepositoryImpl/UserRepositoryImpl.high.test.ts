import "reflect-metadata";
import UserRepositoryImpl from "../../../../../src/Infrastructure/Repositories/UserRepositoryImpl";
import UserPayload from "../../../../../src/Infrastructure/Models/UserPayload";

const findDocumentById = jest.spyOn(
  UserRepositoryImpl.prototype,
  "findDocumentById"
);
const saveMock = jest.fn();

jest.mock("../../../../../src/Infrastructure/Models/UserMongooseModel", () => {
  return jest.fn().mockImplementation(() => ({
    save: saveMock,
  }));
});
describe("UserRepository high mock test suite", () => {
  let sut: UserRepositoryImpl;
  const userPayload: UserPayload = {
    name: "Test User",
    email: "test@example.com",
    password: "UserPassword",
  };
  beforeEach(() => {
    sut = new UserRepositoryImpl();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should create User", async () => {
    const mockUser: UserPayload = new UserPayload(
      userPayload.name,
      userPayload.email,
      userPayload.password
    );

    await sut.createUser(mockUser);

    expect(saveMock).toHaveBeenCalled();
  });
  it("should throw an error for invalid UserPayload", async () => {
    const mockUser = {};
    const t = async () => {
      await sut.createUser(mockUser);
    };
    await expect(t).rejects.toThrow(Error);
  });
  it("should findUserById if valid id provided", async () => {
    const validUserId = "63e70e810d1cf296b3c3596a";
    const expectedUser = { _id: "validId", ...userPayload };
    findDocumentById.mockResolvedValueOnce(expectedUser as any);

    const actual = await sut.findById(validUserId);

    expect(actual).toEqual(expectedUser);
  });
  it("should not findUserById if invalid id provided", async () => {
    const inValidUserId = "invalidID";

    const t = async () => {
      await sut.findById(inValidUserId);
    };

    await expect(t).rejects.toThrow("Invalid ID");
  });
  it("should not findUserById if no Id provided", async () => {
    const emptyArgumentForFindUserByIdMethod = "      ";

    const t = async () => {
      await sut.findById(emptyArgumentForFindUserByIdMethod);
    };

    await expect(t).rejects.toThrow("Invalid ID");
  });
});
