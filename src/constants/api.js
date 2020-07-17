const host = 'http://172.21.118.79:8090/accc-openapi';

// user
export const API_USER_LOGIN = `${host}/login`; // 登录
export const API_USER_LOGOUT = `${host}/doLogout`; // 登出
export const API_USER_CODE = `${host}/anon/sendCode`; // 获取验证码
export const API_USER_REGISTER = `${host}/register`; // 注册
export const API_USER_BIND_COMPANY_ROLE = `${host}/user/bind-company-role`; // 绑定公司
export const API_USER_USERDETAIL = `${host}/user/userdetail`; // 保存用户信息

// company
export const API_COMPANY_ALL = `${host}/company/all`; // 查询全部公司

// work-type
export const API_COMP_WORK_TYPE = `${host}/work-type/all/companyCode`; // 查询工作类型

// passarea
export const API_PASSAREA_ALL = `${host}/passarea/all/companyCode`; // 获取公司所有通行证

// hres
// export const API_HRES_SAVE = `${host}/hres/save`; // 创建员工
export const API_HRES_LIST = `${host}/hres/list`; // 查询某个工种下的全部员工

// rspublish
export const API_RSPUBLISH_SAVE = `${host}/rspublish/save`; // 创建人力资源发布
export const API_RSPUBLISH_LIST = `${host}/rspublish/list`; // 发布列表

// cargostation
export const API_CARGOSTATION_LIST = `${host}/cargostation/list`; // 获取所有货站与对应区域
