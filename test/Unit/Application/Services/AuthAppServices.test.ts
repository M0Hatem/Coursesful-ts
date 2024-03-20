import "reflect-metadata";
import AuthAppServices from "../../../../src/Application/Services/AuthAppServices";
import UserRepository from "../../../../src/Domain/Repositories/UserRepository";
import * as hashingUtils from "../../../../src/util/hashPassword";
import UserPayload from "../../../../src/infrastructure/Models/UserPayload";
import ConflictError from "../../../../src/types/errors/ConflictError";
import comparingUtils from "../../../../src/util/passwordCompare";
import * as jwtUtils from "../../../../src/util/SignToken";
import AuthError from "../../../../src/types/errors/AuthError";

const getHashedPasswordMock = jest.spyOn(hashingUtils, "getHashedPassword");
const passwordCompareMock = jest.spyOn(comparingUtils, "passwordCompare");
const signTokenMock = jest.spyOn(jwtUtils, "signToken");
describe("AuthAppService test suite", () => {
  let sut: AuthAppServices;

  const userRepositoryMock = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  const UserCredentials = {
    _id: "UserIdMock",
    name: "Test Name",
    email: "test@example.com",
    password: "somePassword",
  };

  const jwtTokenMock = "12345";
  beforeAll(() => {
    sut = new AuthAppServices(userRepositoryMock as any as UserRepository);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it("should signup if the E-Mail address is unique", async () => {
    userRepositoryMock.findOne.mockResolvedValueOnce(null);
    getHashedPasswordMock.mockResolvedValueOnce("TestHashedPassword");

    await sut.signup(
      UserCredentials.name,
      UserCredentials.email,
      UserCredentials.password
    );

    expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
      new UserPayload(
        UserCredentials.name,
        UserCredentials.email,
        "TestHashedPassword"
      )
    );
  });
  it("should not signup if the E-Mail address is actually exist", async () => {
    userRepositoryMock.findOne.mockResolvedValueOnce({});

    const t = async () => {
      await sut.signup(
        UserCredentials.name,
        UserCredentials.email,
        UserCredentials.password
      );
    };

    await expect(t).rejects.toThrow(
      new ConflictError("E-Mail address already exists!")
    );
  });
  it("should return token after successful login", async () => {
    userRepositoryMock.findOne.mockResolvedValueOnce(UserCredentials);
    passwordCompareMock.mockResolvedValueOnce(true);
    signTokenMock.mockImplementationOnce(() => jwtTokenMock);

    const actual = await sut.login(
      UserCredentials.email,
      UserCredentials.password
    );

    expect(actual).toBe(jwtTokenMock);
  });
  it("should throw an AuthError if no userFound with provided email", async () => {
    userRepositoryMock.findOne.mockResolvedValueOnce(null);

    const t = async () => {
      await sut.login(UserCredentials.email, UserCredentials.password);
    };

    await expect(t).rejects.toThrow(
      new AuthError("Authentication,failed please check your email or password")
    );
  });
  it("should throw an AuthError if password wrong", async () => {
    userRepositoryMock.findOne.mockResolvedValueOnce(UserCredentials);
    passwordCompareMock.mockResolvedValueOnce(false);

    const t = async () => {
      await sut.login(UserCredentials.email, UserCredentials.password);
    };

    await expect(t).rejects.toThrow(
      new AuthError("Authentication,failed please check your email or password")
    );
  });
});
