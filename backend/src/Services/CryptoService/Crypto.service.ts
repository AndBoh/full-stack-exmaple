import crypto from 'crypto';

import { LoggerService } from '@Services/LoggerService/Logger.service';

const hashAlgorithm = 'sha256';
const logger = LoggerService.getLogger('CryptoService');

class CryptoService {
  public static makeHash(data: string, algorithm: string = hashAlgorithm): string {
    const hash = crypto.createHash(algorithm);
    const result = hash.update(data).digest('hex');

    logger.debug(`String "${data}" hashed with algorithm "${hashAlgorithm}" as "${result}"`);

    return result;
  }

  public static makeHashWithSalt(data: string, algorithm: string = hashAlgorithm): string {
    const salt = process.env.HASH_SALT;

    if (!salt) {
      logger.error('HASH_SALT is not set in ENV');
    }

    const stringToHash = `${data}${salt ?? ''}`;
    return CryptoService.makeHash(stringToHash, algorithm);
  }
}

export { CryptoService };
