import { container } from 'tsyringe';
import BcryptProvider from './implementations/BcryptProvider';
import { IHashProvider } from './models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BcryptProvider);
