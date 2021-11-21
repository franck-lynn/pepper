<template>
    <vuer-avatar username="周芷若" :size="100" @avatar-initials="avatarInitials" style=" vertical-align: middle;borderRadius:50%"></vuer-avatar>
    <vuer-avatar username="Darth Vader" :size="100" style=" vertical-align: middle;borderRadius:50%"></vuer-avatar>
    <vuer-avatar username="Darth Vader" src="/gyy.jpg" :size="200" background-color="#ccc" color="#fff" style=" vertical-align: middle;borderRadius:0" :inline="true"></vuer-avatar>
    
    
    <vuer-avatar-cropper></vuer-avatar-cropper>

</template>

<script>
    import { defineComponent, } from 'vue'
    export default defineComponent({
        name: 'profile',
        props: {},
        setup() {
            const avatarInitials = (e1, e2) => {
                console.log("接受子组件发射过来的数据", e1, e2)
            }



            return {
                avatarInitials,
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>