import { CognitoUserPool } from "amazon-cognito-identity-js"

const poolData = { 
    UserPoolId: "us-east-1_WBmKN3at5",
    ClientId: "kgmbkks22he52u9nurnpp3i1r"
};

export default new CognitoUserPool(poolData);