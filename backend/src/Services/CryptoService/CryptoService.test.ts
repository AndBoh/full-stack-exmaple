import crypto from 'crypto';

import { expect } from '@Tests';

import { createRandomString } from '@Tests/Mock';

import { CryptoService } from '@Services/CryptoService/Crypto.service';

const makeHash = (string: string, alg: string = 'sha256') => crypto.createHash(alg).update(string).digest('hex');

describe('CryptoService', () => {
  describe('makeHash', () => {
    it('Корректный хеш, алгорим sha256 о умолчанию', () => {
      const string = createRandomString();
      const hash = makeHash(string);

      expect(CryptoService.makeHash(string)).to.be.eq(hash);
    });

    it('Альтернативный алгорим', () => {
      const algorithm = 'md5';
      const string = createRandomString();
      const hash = makeHash(string, algorithm);

      expect(CryptoService.makeHash(string, algorithm)).to.be.eq(hash);
    });
  });

  describe('makeHashWithSalt', () => {
    it('Корректный хеш с солью из ENV', () => {
      const salt = process.env.HASH_SALT ?? '';
      const string = createRandomString();
      const hash = makeHash(`${string}${salt}`);

      expect(CryptoService.makeHashWithSalt(string)).to.be.eq(hash);
    });
  });
});
