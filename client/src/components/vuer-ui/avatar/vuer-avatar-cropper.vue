<template>
    <!-- <form method="post" action="/#/uploadFile"> -->
    <div class="vuer-avatar-cropper-demo">
        <!-- 这部分可以是显示用户图像或者预览 -->
        <div class="vuer-card-body">2
            <!-- <div :class="['vuer-card-pick', isPreview?  'preview': null]"> -->
            <div :class="['vuer-card-pick']">
                <!-- 不是预览时显示 img 标签, 是预览时不显示 img 标签 -->
                <img :src="user.avatar" class="vuer-card-img avatar " v-if="!isPreview" />
                <div class="vuer-card-img avatar preview" v-if="isPreview"></div>
                <div class="vuer-card-img-overlay">
                    <!-- 点击 button 提交的, 如果没有这个路由就会报错 -->
                    <button class="pick-avatar-btn" id="pick-avatar">Select an new image</button>
                </div>
            </div>
            <div class="vuer-title-muted">
                <span class="vuer-card-title">{{ user.username }}</span>
                <span v-if="user.nickname" class="vuer-text-muted">{{ user.nickname }}</span>

            </div>

        </div>
        <div class="vuer-card-footer">
            <span>{{message}}</span>
            <vuer-button :plain=!isDisabled :type="!isDisabled? 'success': null" :disabled=isDisabled v-if="isSave" @click=handleUpdateAvatar>保存</vuer-button>
        </div>

        <avatar-cropper @uploading="handleUploading" @uploaded="handleUploaded" @completed="handleCompleted" @error="handlerError" trigger="#pick-avatar" :upload-url=uploadUrl @destroy=handleDestroy v-model="isPreview" />
    </div>
    <!-- </form> -->
</template>

<script>
    import { queryLoginedUser, updateAvatar } from '../../helpers'
    import { defineComponent, onMounted, reactive, ref } from 'vue'
    export default defineComponent({
        name: 'vuer-avatar-cropper',
        props: {},
        setup() {
            // avatar-cropper 的父组件
            // 直接向服务器提交. 存在跨域问题
            // const uploadUrl = ref(`${process.env.URL}:${process.env.CLINET_PORT}/#/upload-file`)
            const uploadUrl = ref(`/upload-file`)
            const isPreview = ref(false)
            const message = ref('ready')
            const isSave = ref(false)
            const isDisabled = ref(false) // 保存过了就不要再保存了

            const user = reactive({
                // nickname: '张无忌老婆',
                username: null,
                avatar: null,
            })
            const handleUpdateAvatar = async () => {
                //TODO: 处理保存按钮的点击, 交由 graphql 服务器处理
                const variables = {
                    avatarUrl: user.avatar
                }
                const res = await updateAvatar(variables)
                isDisabled.value = true // 说明保存过了, 就不要再点击保存了, 不加重服务器负担
                console.log('graphql 服务器返回的信息---> ', res.data.updateAvatar)
            }

            const handleDestroy = (e) => {
                isPreview.value = e
            }
            const handleUploading = ( /* from, xhr */ ) => {
                // console.log("处理正在上传过程中, 是uploadImage()方法发射过来的---> ", from, xhr)
                message.value = "uploading..."
            }

            const handleUploaded = (response) => {
                // 上传图片成功后进行设置
                if (response.code == 200 && response.data) {
                    // console.log("打印服务器端返回的信息----> ", response.data.filename)
                    // console.log("环境变量中的设置----> ", response)
                    user.avatar = response.data.filename
                    message.value = "user avatar updated."
                    isSave.value = true
                    // 上传图片成功要打开保存按钮
                    isDisabled.value = false
                } else {
                    message.value = response.msg
                    isSave.value = false
                }
            }
            const handleCompleted = ( /* response, form, xhr */ ) => {
                // console.log("处理正在上传完成, 是uploadImage()方法发射过来的---> ", response, form, xhr)
                message.value = "upload completed."
            }
            const handlerError = ( /* message, type, xhr */ ) => {
                // console.log("处理正在上传出现的错误, 是uploadImage()方法发射过来的---> ", message, type, xhr)
                message.value = "Oops! Something went wrong..."
            }

            onMounted(async () => {
                const logined = await queryLoginedUser()
                user.username = logined.name
                // 设置一个默认值
                user.avatar = logined.avatar || user.avatar || '/gyy.jpg'
            })


            return {
                isPreview,
                // avatarInitials,
                uploadUrl,
                message,
                user,
                handleUploading,
                handleUploaded,
                handleCompleted,
                handlerError,
                handleDestroy,
                isSave,
                handleUpdateAvatar,
                isDisabled
            }
        }
    })
</script>

<style lang="scss" scoped>
    $width-card: 18rem;
    $height-card: 18rem;
    $width-card-body: 12.25rem; // 图片宽度为 0.68 * $width-card
    $height-card-body-mt: 1.25rem; // 图片的上边距
    $height-btn: 2.25rem;
    $width-btn: 10rem;

    .#{$prefix}avatar-cropper-demo {
        max-width: $width-card; // 卡片最大宽度
        min-height: $height-card;
        margin: 0 auto; // 卡片居中
        display: flex;
        flex-direction: column;
        background-color: #fff;
        box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);
        border-radius: 6px;


        .#{$prefix}card-body {
            width: $width-card-body; // 图片 + 文字
            // height: $width-card-body;
            flex: 1 1 auto;
            align-self: center;
            margin-top: $height-card-body-mt;

            position: relative;

            .#{$prefix}card-pick {
                width: $width-card-body; // 图片 + 文字
                height: $width-card-body;
                // border: 1px solid red;
                overflow: hidden;

                // border-radius: 6px;
                // border-radius:50%; // 图片是否是全倒圆?
                // display: flex;
                // justify-content: center;
                .#{$prefix}card-img {
                    // width: 100%; // 图片大小
                    height: 100%;
                    border-radius: 6px;
                    // border-radius:50%; // 图片是否是全倒圆?
                    display: block;
                    position: relative;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .#{$prefix}card-img-overlay {
                    display: none; // 图片下方的按钮
                    height: $height-btn;
                    width: $width-btn;
                    transition: all 0.5s;
                    position: absolute;
                    top: $width-card-body - $height-btn / 1.6; // 稍微偏上一点
                    left: ($width-card-body - $width-btn) / 2;


                    .pick-avatar-btn {
                        background-color: #0069D9;
                        color: #fff;
                        border: 0;
                        border-radius: 4px;
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            .#{$prefix}title-muted {
                justify-content: center;
                text-align: center;
            }

            .#{$prefix}card-title {
                height: 32px;
                font-size: 1.25rem;
                font-weight: bold;
            }

            .#{$prefix}card-title,
            .#{$prefix}text-muted {
                display: inline-flex;
                margin: 8px;
            }



            &:hover {
                .#{$prefix}card-img-overlay {
                    display: block;
                }
            }
        }

        .#{$prefix}card-footer {
            width: 100%;
            height: 45px;
            line-height: 45px;
            text-align: center;
            background-color: #f9f9f9;
            bottom: 0;


            $height-button: 24px;
            $height-button-font: 16px;
            $padding-tb: ($height-button -$height-button-font) / 2; // button 上下的padding

            ::v-deep(.vuer-button) {
                padding: $padding-tb 20px; // 上下各13px, 总共26px, 左右各20px
                font-size: $height-button-font; // 字体高 18px, 26+18=44px+ 边线宽1px, 2边就是2px, 总共46px
                margin-left: 12px;
            }
        }
    }
</style>