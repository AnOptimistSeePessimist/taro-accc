const host = 'http://172.21.118.79:8090/accc-openapi';

// user
export const API_USER_LOGIN = `${host}/login`; // 登录
export const API_USER_CODE = `${host}/anon/sendCode`; // 获取验证码
export const API_USER_REGISTER = `${host}/register`; // 注册
export const API_USER_BIND_COMPANY_ROLE = `${host}/user/bind-company-role`; // 绑定公司

// company
export const API_COMPANY_ALL = `${host}/company/all`; // 查询全部公司

// work-type
export const API_COMP_WORK_TYPE = `${host}/work-type/all/companyCode`; // 查询工作类型
