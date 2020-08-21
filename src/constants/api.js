const ipAddress = '172.21.118.79';
const port = 8090;

const host = `http://${ipAddress}:${port}/accc-openapi`;
export const IMAGE_PREFIX = `http://${ipAddress}:8089/accc-web-app/file`;

// user
export const API_USER_LOGIN = `${host}/login`; // 登录
export const API_USER_LOGOUT = `${host}/doLogout`; // 登出
export const API_USER_CODE = `${host}/anon/sendCode`; // 获取验证码
export const API_USER_REGISTER = `${host}/register`; // 注册
// export const API_USER_BIND_COMPANY_ROLE = `${host}/user/bind-company-role`; // 绑定公司
export const API_USER_USERDETAIL = `${host}/user/userdetail`; // 保存用户信息

// company
export const API_COMPANY_ALL = `${host}/company/all`; // 查询全部公司

// work-type
export const API_COMP_WORK_TYPE = `${host}/work-type/all/companyCode`; // 查询工作类型
export const API_WORK_TYPE_LIST = `${host}/work-type/list`; // 根据条件分页查询工作类型
export const API_WORK_TYPE_DISTINCT = `${host}/work-type/distinct/all`; // 获取可出租的工作类型

// passarea
export const API_PASSAREA_ALL = `${host}/passarea/all/companyCode`; // 获取公司所有通行证

// hres
// export const API_HRES_SAVE = `${host}/hres/save`; // 创建员工
export const API_HRES_LIST = `${host}/hres/list`; // 查询某个工种下的全部员工
export const API_HRES_VERIFY = `${host}/hres/verify` // 设置员工审核状态

// rspublish
export const API_RSPUBLISH_SAVE = `${host}/rspublish/save`; // 创建人力资源发布
export const API_RSPUBLISH_LIST = `${host}/rspublish/list`; // 发布列表
export const API_RSPUBLISH_DELETE = `${host}/rspublish`; // 删除发布的资源
export const API_RSPUBLISH_GET = `${host}/rspublish`; // 根据记录id获取资源发布

// cargostation
export const API_CARGOSTATION_LIST = `${host}/cargostation/list`; // 获取所有货站与对应区域

//order
export const API_ORDER_CREATE = `${host}/order/create`; // 创建订单和详情
export const API_ORDER_ONELIST = `${host}/orderstatus/list` // 通过订单id获取订单所有状态
export const API_ORDER_MYORDER = `${host}/order/myOrder`; // 我的订单
export const API_ORDER_MYTRADE = `${host}/order/myTrade`; // 我的交易
export const API_ORDER_ORDERONE = `${host}/order`; // 通过订单编号获取订单信息
export const API_ORDER_RS = `${host}/order/rs`; // 通过订单id获取对应的员工

//callback
export const API_CALLBACK_WX = `${host}/callback/wx-pay`; // 微信支付

//workorder
export const API_WORK_ORDER_LIST = `${host}/workorder/list`; // 工单条件查询
export const API_WORK_ORDER_MY = `${host}/workorder/my`; // 我的工单
export const API_WORK_ORDER_DISTRIBUTE = `${host}/workorder/distribute`; // 派工单
export const API_WORK_ORDER_CHECK_IN = `${host}/workorder/check-in`; // 签到打卡
export const API_WORK_ORDER_CHECK_OUT = `${host}/workorder/check-out` // 完工打卡
export const API_WORK_ORDER_RECID = `${host}/workorder`; // 通过工单id查询工单

// wechat
export const API_SEND_SUBSCRIBE_MSG = `${host}/wechat/sendSubscribeMsg`; // 发送订阅消息
