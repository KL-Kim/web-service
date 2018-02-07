import { expect } from 'chai';
import { loginFetch } from '../js/helpers/user.service';

const credentials = {
  email: 'user0@abc.com',
  password: '1234567890'
};

describe("User Service Server", () => {
  beforeEach(() => {
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({ok: true, token: '*.*.*'}));
  });

  it("should login Successfully and receive access token", async () => {
    const response = await loginFetch(credentials.email, credentials.password)
  });
});
