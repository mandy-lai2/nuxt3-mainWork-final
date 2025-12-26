import {getRoomList} from '@/api/roomList'
import {getRoom} from '@/api/room'
import {getLogin} from '@/api/login'
import {postBookingOrders} from '@/api/bookingOrders'
import {getOrder} from '@/api/order'
import {getOrderList} from '@/api/orderList'
import {getDeleteOrder} from '@/api/orderDelete'
import {postVerifyEmail} from '@/api/verifyEmail'

export const apiGetRoomList = getRoomList;
export const apiGetRoom = getRoom;
export const apiGetLogin = getLogin;
export const apiPostBookingOrders = postBookingOrders;
export const apiGetOrder = getOrder;
export const apiGetOrderList = getOrderList;
export const apiGetDeleteOrder = getDeleteOrder;
export const apiPostVerifyEmail = postVerifyEmail;

