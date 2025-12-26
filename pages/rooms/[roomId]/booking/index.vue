<script setup>
// import { ref } from 'vue';
// import { useRouter } from 'vue-router';
// import { Icon } from '@iconify/vue';
import BookingLoading from '@/components/rooms/BookingLoading.vue';
import { apiPostBookingOrders } from '@/api/index'

const { formatNumber } = useFormatNumber()

const isLoading = ref(false);
const submitButtonRef = ref(null);
const vformRef = ref(null);

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const bookingStore = useBookingStore()
// const { setBookingLatest } = bookingStore
const { bookingLatest } = storeToRefs(bookingStore)

const router = useRouter();
const goBack = () => {
  router.back();
}
const goRoomList = () => {
  navigateTo(`/rooms`)
}

//房間、訂單、幾晚資料
const roomInfo = ref({})
const orderInfo = ref({})
const daysCount = ref(0)
if (bookingLatest.value) {
  roomInfo.value = bookingLatest.value.roomInfo
  orderInfo.value = bookingLatest.value.orderInfo
  daysCount.value = bookingLatest.value.daysCount
  // console.log("booking資料->", bookingLatest.value.roomInfo);
}
//帶入縣市、區
import cityData from '../../../../public/taiwanCityData.json';
const cityList = computed(()=>{
  return cityData.map((item)=> item.name)
})
const districtsList = ref({})
const findDistricts = ()=>{
  districtsList.value = cityData.find((item)=> item.name === vformRef.value.values['縣市'])
  // console.log("vformRef資料=>",vformRef.value.values['縣市']);  
  
}
//套用會員資料
const useUserData = ()=>{
  vformRef.value.setFieldValue('姓名',userInfo.value.name)
  vformRef.value.setFieldValue('手機號碼',userInfo.value.phone)
  vformRef.value.setFieldValue('email',userInfo.value.email)
  vformRef.value.setFieldValue('縣市',userInfo.value.address.city)
  // vformRef.value.setFieldValue('zone',userInfo.value.address.county)
  vformRef.value.setFieldValue('詳細地址',userInfo.value.address.detail)
  if(vformRef.value.values['縣市']){
    findDistricts()
    // console.log("districtsList.value->",districtsList.value.districts);
    const zipcode = districtsList.value.districts.find((item) => item.name === userInfo.value.address.county )
    vformRef.value.setFieldValue('zone', zipcode.zip)
     }
    //  console.log("vformRef=>",vformRef.value.meta.valid);
    }

//是否有填寫完成，顯示按鈕
const isBtnShow = computed(()=>{
  return vformRef.value?.meta.valid
})


const confirmBooking = () => {
  submitButtonRef.value.click()
}
const onSubmit = async (inputValue,{ resetForm })=>{
  isLoading.value = true;
  const bookingOrderInfo = {
    "roomId": orderInfo.value.roomId,
    "checkInDate": orderInfo.value.checkInDate,
    "checkOutDate": orderInfo.value.checkOutDate,
    "peopleNum": orderInfo.value.peopleNum,
    "userInfo": {
      "address": {
        "zipcode": inputValue.zone,
        "detail": inputValue.詳細地址
      },
      "name": inputValue.姓名,
      "phone": inputValue.手機號碼,
      "email": inputValue.email
    }
  }
  
  const token = useCookie("auth").value
  const bookingResult = await apiPostBookingOrders(bookingOrderInfo, token)
  // console.log("bookingResult=>", bookingResult);
  if(!bookingResult.status){
    alert(bookingResult?.message._value)
    
  }
  isLoading.value = false;
  navigateTo(`/booking/confirmation/${bookingResult.result._id}`)
  // isLoading.value = false;
}

// const confirmBooking = () => {
//   isLoading.value = true;
//   setTimeout(() => {
//     isLoading.value = false;
//     router.push({
//       name: 'rooms-roomId-booking-confirmation',
//       params: {
//         roomId: '1234'
//       }
//     })
//   }, 1500);
// }


</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0" type="button" @click="goBack">
          <Icon class="fs-5 text-neutral-100" icon="mdi:keyboard-arrow-left" />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">
            確認訂房資訊
          </h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      選擇房型
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ roomInfo.name }}
                    </p>
                  </div>
                  <button class="bg-transparent border-0 fw-bold text-decoration-underline" type="button"
                    @click="goRoomList">
                    編輯
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      訂房日期
                    </h3>
                    <p class="mb-2 fw-medium" v-dayFormat="orderInfo.checkInDate">
                      入住：[day]
                    </p>
                    <p class="mb-0 fw-medium" v-dayFormat="orderInfo.checkOutDate">
                      退房：[day]
                    </p>
                  </div>
                  <button class="bg-transparent border-0 fw-bold text-decoration-underline" type="button"
                    @click="goBack">
                    編輯
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      房客人數
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ orderInfo.peopleNum }} 人
                    </p>
                  </div>
                  <button class="bg-transparent border-0 fw-bold text-decoration-underline" type="button"
                    @click="goBack">
                    編輯
                  </button>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <section>
              <div class="d-flex justify-content-between align-items-center mb-10">
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button" @click="useUserData">
                  套用會員資料
                </button>
              </div>

              <VForm v-slot="{ errors }" class="d-flex flex-column gap-6" @submit="onSubmit" ref="vformRef">
                <div class="text-neutral-100">
                  <label for="name" class="form-label fs-8 fs-md-7 fw-bold">姓名</label>
                  <VField id="name" type="text" class="form-control p-4 fs-8 fs-md-7 rounded-3" placeholder="請輸入姓名"  name="姓名" :class="{ 'is-invalid': errors['姓名'] }" rules="required|min:2" />
                  <VErrorMessage class="invalid-feedback" name="姓名" />
                </div>

                <div class="text-neutral-100">
                  <label for="phone" class="form-label fs-8 fs-md-7 fw-bold">手機號碼</label>
                  <VField id="phone" type="tel" class="form-control p-4 fs-8 fs-md-7 rounded-3" placeholder="請輸入手機號碼"  name="手機號碼" :class="{ 'is-invalid': errors['手機號碼'] }" rules="required|isPhone" />
                  <VErrorMessage class="invalid-feedback" name="手機號碼" />
                </div>

                <div class="text-neutral-100">
                  <label for="email" class="form-label fs-8 fs-md-7 fw-bold">電子信箱</label>
                  <VField id="email" type="email" class="form-control p-4 fs-8 fs-md-7 rounded-3" placeholder="請輸入電子信箱"  name="email" :class="{ 'is-invalid': errors['email'] }" rules="required|email" />
                  <VErrorMessage class="invalid-feedback" name="email" />
                </div>

                <div class="text-neutral-100">
                  <label for="address" class="form-label fs-8 fs-md-7 fw-bold">地址</label>
                  <div className="d-flex gap-2 mb-4">
                    <VField as="select" class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"  name="縣市" :class="{ 'is-invalid': errors['縣市'] }" rules="required"  @change="findDistricts">
                      <option selected disabled value="">請選擇縣市</option>
                      <option v-for="city in cityList" :key="city" :value="city">
                        {{ city }}
                      </option>
                    </VField>
                    <VErrorMessage class="invalid-feedback" name="縣市" />
                    <VField as="select" class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"  name="zone" :class="{ 'is-invalid': errors['zone'] }" rules="required">
                      <option selected disabled value="">請選擇行政區</option>
                      <option v-for="districts in districtsList.districts" :key="districts.zip" :value="districts.zip">
                        {{districts.name}}
                      </option>
                    </VField>
                    <VErrorMessage class="invalid-feedback" name="zone" />
                  </div>
                  <VField id="address" type="text" class="form-control p-4 fs-8 fs-md-7 rounded-3" placeholder="請輸入詳細地址"  name="詳細地址" :class="{ 'is-invalid': errors['詳細地址'] }" rules="required" />
                  <VErrorMessage class="invalid-feedback" name="詳細地址" />
                </div>
                <button ref="submitButtonRef" type="submit" class="d-none"></button> 
              </VForm>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">
            
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon class="mb-2 fs-5 text-primary-100" icon="fluent:slide-size-24-filled" />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{roomInfo.areaInfo}}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon class="mb-2 fs-5 text-primary-100" icon="material-symbols:king-bed" />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{roomInfo.bedInfo}}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon class="mb-2 fs-5 text-primary-100" icon="ic:baseline-person" />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-{{roomInfo.maxPeople}} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房間格局
                  </h3>
                  <ul class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <template  v-for="(layout,idx) in roomInfo.layoutInfo" >
                      <li class="d-flex gap-2" :key="idx" v-if="layout.isProvide">
                        <Icon class="fs-5 text-primary-100" icon="material-symbols:check" />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{layout.title}}
                        </p>
                      </li>
                    </template>
                    
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房內設備
                  </h3>
                  <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <template  v-for="(facility,idx) in roomInfo.facilityInfo" >
                      <li class="flex-item d-flex gap-2" :key="idx" v-if="facility.isProvide">
                      <Icon class="fs-5 text-primary-100" icon="material-symbols:check" />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{facility.title}}
                      </p>
                      </li>
                    </template>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    備品提供
                  </h3>
                  <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <template  v-for="(amenity,idx) in roomInfo.amenityInfo" >
                      <li class="flex-item d-flex gap-2" :key="idx" v-if="amenity.isProvide">
                      <Icon class="fs-5 text-primary-100" icon="material-symbols:check" />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{amenity.title}}
                      </p>
                      </li>
                    </template>
                    
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0">
              <img class="img-fluid rounded-3" src="@/assets/images/room-a-1.png" alt="room-a">

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="d-flex align-items-center text-neutral-100 fw-medium">
                    <span>NT$ {{formatNumber(roomInfo.price)}}</span>
                    <Icon class="ms-2 me-1 text-neutral-80" icon="material-symbols:close" />
                    <span class="text-neutral-80">{{ daysCount }} 晚</span>
                  </div>
                  <span class="fw-medium">
                    NT$ {{formatNumber(roomInfo.price * daysCount)}}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center fw-medium">
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    -NT$ 0
                  </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40">
                <div class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold">
                  <p class="d-flex align-items-center mb-0">
                    總價
                  </p>
                  <span>
                    NT$ {{formatNumber(roomInfo.price * daysCount)}}
                  </span>
                </div>
              </div>

              <button class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3" type="button"
                @click="confirmBooking" :disabled="!isBtnShow">
                確認訂房
              </button>
              
              
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #BF9D7D;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>