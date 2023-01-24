import { Injectable } from '@nestjs/common';

import {
  CognitoUserPool,
  ICognitoUserPoolData,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

import { AuthRegistroUsuarioDto } from '../auth/dtos/auth-registro-usuario.dto';
import { AwsCognitoConfig } from './aws-cognito-config';
import { AuthLoginUsuarioDto } from '../auth/dtos/auth-login-usuario.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;
  private userPoolConfigData: ICognitoUserPoolData;

  constructor(private awsConfig: AwsCognitoConfig) {
    this.userPoolConfigData = this.awsConfig.cognitoUserPoolConfigData();
    this.userPool = new CognitoUserPool(this.userPoolConfigData);
  }

  async registrarUsuario(authRegistroUsuario: AuthRegistroUsuarioDto) {
    const { nome, email, senha, telefoneCelular } = authRegistroUsuario;
    const userAttributes = {
      phoneNumber: new CognitoUserAttribute({
        Name: 'phone_number',
        Value: telefoneCelular,
      }),
      name: new CognitoUserAttribute({
        Name: 'name',
        Value: nome,
      }),
    };

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        senha,
        [userAttributes.phoneNumber, userAttributes.name],
        null,
        (err, result) => {
          if (!result || err) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async autenticarUsuario(authLoginUsuarioDto: AuthLoginUsuarioDto) {
    const { email, senha } = authLoginUsuarioDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: senha,
    });

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
