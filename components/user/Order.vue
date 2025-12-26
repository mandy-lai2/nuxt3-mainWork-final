<script setup>
// import { Icon } from '@iconify/vue';

import {apiGetOrderList, apiGetDeleteOrder } from "@/api/index"
const router = useRouter()
const token = useCookie("auth").value


// 分類歷史or即將到來訂單 and 秀出歷史訂單
const othersOrder = ref([])
const comingOrder = ref([])
const orderShowHistorylist = ref([])
// console.log("api訂單列表結果=>",status,orderList);
const {countDay} = useDayNum()

const {status, data:orderList} = await apiGetOrderList(token)

  if(status.value === "success"){
    //重組
    const adjustOrderList = orderList.value.map((order)=>{
      const startDate = order.checkInDate.split('T')[0];
      const endDate = order.checkOutDate.split('T')[0];
      const totalDays = countDay(startDate,endDate)
      return {...order,startDate,endDate,totalDays}
    })
    //排序
    const sorted = adjustOrderList.sort((pre, curr)=> {
      new Date(pre.checkInDate) - new Date(curr.checkInDate)
    })
    
    //即將來的行程
    comingOrder.value = sorted.find((order)=>  new Date(order.checkInDate) > new Date())
    //其他行程
    let found = false;
    othersOrder.value = sorted.filter(order => {
      if (!found && order._id === comingOrder.value._id) {
        found = true;
        return false;
      }
      return true;
    });
    // 秀出歷史訂單的列表
    orderShowHistorylist.value = othersOrder.value.length > 3 ? othersOrder.value.splice(0, 3) : othersOrder.value;

    // console.log("即將訂單",comingOrder.value);
    // console.log("other訂單",othersOrder.value);
    // console.log("秀出歷史訂單",orderShowHistorylist.value);
    
  }else{
    alert("請重新登入")
  }

const cancelOrder = async ()=>{
  const {status, message: errorMessage} = await apiGetDeleteOrder(comingOrder.value._id, token)
  console.log("apiGetDeleteOrder->",status, errorMessage);
  
  if(!status) {
    if (errorMessage) {
      alert({message: errorMessage})
    }else{
      alert("error")
    }
    return
  }
  alert(`已取消預定！${comingOrder.value._id}`)
  router.go(0)

}
//加入更多歷史訂單
const addHistoryOrder = ()=>{
  orderShowHistorylist.value = othersOrder.value
}

</script>

<template>
  <div>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-7">
      <div
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
        style="max-width: 730px;"
      >
        <div>
          <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
            預訂參考編號： {{comingOrder._id}}
          </p>
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
            即將來的行程
          </h2>
        </div>

        <img
          class="img-fluid rounded-3"
          :src="comingOrder.roomId.imageUrl"
          :alt="comingOrder.roomId.name"
        >

        <section class="d-flex flex-column gap-6">
          <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
            <p class="mb-0">
             {{comingOrder.roomId.name}}，{{comingOrder.totalDays}}晚
            </p>
            <span
              class="d-inline-block mx-4 bg-neutral-80"
              style="width: 1px;height: 18px;"
            />
            <p class="mb-0">
              住宿人數：{{comingOrder.peopleNum}}位
            </p>
          </h3>

          <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
            <p class="title-deco mb-2" v-dayFormat="comingOrder.checkInDate">
              入住：[day]，15:00 可入住
            </p>
            <p class="title-deco mb-0"  v-dayFormat="comingOrder.checkOutDate" >
              退房：[day]，12:00 前退房
            </p>
          </div>

          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
            NT$ {{comingOrder.roomId.price * comingOrder.totalDays}}
          </p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40">

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            房內設備
          </h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <template v-for=" (facility,idx) in comingOrder.roomId.facilityInfo">
              <li class="flex-item d-flex gap-2" :key="idx" v-if="facility.isProvide">
                <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
                />
                <p class="mb-0 text-neutral-80 fw-bold">
                  {{facility.title}}
                </p>
              </li>
            </template>
          </ul>
        </section>

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            備品提供
          </h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <template v-for=" (amenity,idx) in comingOrder.roomId.amenityInfo">
              <li class="flex-item d-flex gap-2" :key="idx" v-if="amenity.isProvide">
                <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
                />
                <p class="mb-0 text-neutral-80 fw-bold">
                  {{amenity.title}}
                </p>
              </li>
            </template>
          </ul>
        </section>

        <div class="d-flex gap-4">
          <button
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            取消預訂
          </button>
          <NuxtLink
            :to="`/rooms/${comingOrder?.roomId?._id}`"
            class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
            type="button"
          >
            查看詳情
          </NuxtLink>
          <!-- <NuxtLink
            :to="{
              name: 'room-detail',
              params: {
                roomId
              }
            }"
            class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
            type="button"
          >
            查看詳情
          </NuxtLink> -->
        </div>
      </div>
    </div>
    <div class="col-12 col-md-5">
      <div
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
          其他訂單
        </h2>
        <div v-for="(orderHistory,idx) in orderShowHistorylist" :key="idx">
        <div class="d-flex flex-column flex-lg-row gap-6" >
          <img
            class="img-fluid object-fit-cover rounded-3"
            style="max-width: 120px; height: 80px;"
            :src="orderHistory.roomId.imageUrl"
            :alt="orderHistory.roomId.name"
          >
          <section class="d-flex flex-column gap-4">
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
              預訂參考編號： {{orderHistory._id}}
            </p>
          
            <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
              {{ orderHistory.roomId.name }}
            </h3>

            <div class="text-neutral-80 fw-medium">
              <p class="mb-2">
                住宿天數： {{orderHistory.totalDays}} 晚
              </p>
              <p class="mb-0">
                住宿人數：{{orderHistory.peopleNum}} 位
              </p>
            </div>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
              <p class="title-deco mb-2"  v-dayFormat="orderHistory.checkInDate">
                入住：[day]，15:00 可入住
              </p>
              <p class="title-deco mb-0"   v-dayFormat="orderHistory.checkOutDate">
                退房：[day]，12:00 前退房
              </p>
            </div>
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
              NT$ {{orderHistory.roomId.price * orderHistory.totalDays}}
            </p>
          </section>
        </div>

        <hr class="my-0 opacity-100 text-neutral-40">
      </div>

        <!-- <div class="d-flex flex-column flex-lg-row gap-6">
          <img
            class="img-fluid object-fit-cover rounded-3"
            style="max-width: 120px; height: 80px;"
            src="@/assets/images/room-b-sm-1.png"
            alt="room-a"
          >
          <section class="d-flex flex-column gap-4">
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
              預訂參考編號： HH2302183151222
            </p>
          
            <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
              尊爵雙人房
            </h3>

            <div class="text-neutral-80 fw-medium">
              <p class="mb-2">
                住宿天數： 1 晚
              </p>
              <p class="mb-0">
                住宿人數：2 位
              </p>
            </div>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
              <p class="title-deco mb-2">
                入住：6 月 10 日星期二，15:00 可入住
              </p>
              <p
                class="title-deco mb-0"
              >
                退房：6 月 11 日星期三，12:00 前退房
              </p>
            </div>
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
              NT$ 10,000
            </p>
          </section>
        </div>

        <hr class="my-0 opacity-100 text-neutral-40"> -->

        <!-- <div class="d-flex flex-column flex-lg-row gap-6">
          <img
            class="img-fluid object-fit-cover rounded-3"
            style="max-width: 120px; height: 80px;"
            src="@/assets/images/room-b-sm-1.png"
            alt="room-a"
          >
          <section class="d-flex flex-column gap-4">
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
              預訂參考編號： HH2302183151222
            </p>
          
            <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
              尊爵雙人房
            </h3>

            <div class="text-neutral-80 fw-medium">
              <p class="mb-2">
                住宿天數： 1 晚
              </p>
              <p class="mb-0">
                住宿人數：2 位
              </p>
            </div>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
              <p class="title-deco mb-2">
                入住：6 月 10 日星期二，15:00 可入住
              </p>
              <p
                class="title-deco mb-0"
              >
                退房：6 月 11 日星期三，12:00 前退房
              </p>
            </div>
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
              NT$ 10,000
            </p>
          </section>
        </div> -->

        <button
          class="btn btn-outline-primary-100 py-4 fw-bold"
          style="--bs-btn-hover-color: #fff"
          type="button"
          @click="addHistoryOrder"
        >
          查看更多
        </button>
      </div>
    </div>
  </div>

  <div id="cancelModal" class="modal fade" tabindex="-1"  >
    <div class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold">
          確定要取消此房型的預訂嗎？
        </div>
        <div class="modal-footer d-flex gap-4">
          <button
            type="button"
            class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            data-bs-dismiss="modal"
          >
            關閉視窗
          </button>
          <button
            type="button"
            class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
            @click="cancelOrder()"
          >
            確定取消
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px
);


.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #BF9D7D;
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}


.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>