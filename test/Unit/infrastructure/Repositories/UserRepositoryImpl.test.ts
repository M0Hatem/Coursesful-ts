import "reflect-metadata";
import UserRepositoryImpl from "../../../../src/infrastructure/Repositories/UserRepositoryImpl";
import UserPayload from "../../../../src/infrastructure/Models/UserPayload";
import UserMongooseModel from "../../../../src/infrastructure/Models/UserMongooseModel";

const saveMock = jest.fn();
const findByIdMock = jest.fn();
jest.mock("../../../../src/infrastructure/Models/UserMongooseModel", () => {
  return jest.fn().mockImplementation(() => ({
    save: saveMock,
    findById: findByIdMock,
  }));
});
describe("UserRepository test suite", () => {
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

    // const actual = await sut.findById(validUserId);
    //
    // expect(actual).toEqual(expectedUser);
  });
});
