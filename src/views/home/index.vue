<template>
    <div class="page-container home-page">

        <div class="base-container">
            <div class="img-main">
                <div>用户角色关系图：</div>
                <img :src="img">
            </div>

            <div class="desc-container">
                <div class="desc-item">一个人（手机号、身份证），一个账号；</div>
                <div class="desc-item">一个账号，多个用户（一个主用户、多个普通用户）；</div>
                <div class="desc-item">一个用户，一个机构；</div>
                <div class="desc-item">一个机构，多个角色（默认角色：该机构或其子机构的用户默认享有的角色，可配置该默认角色的使用范围为本级或本级及子级；自定义角色：只限该机构的用户的角色）；</div>
                <div class="desc-item">可为角色分配客户端权限和菜单权限，系统的菜单信息可关联后端的API权限接口，分配该菜单权限的角色即享有这些API接口权限；</div>
            </div>
        </div>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"
    export default {
        name: "home",

        data() {
            return {
                img:require("@/assets/images/home/support_trans.png")
            }
        }
    }
</script>

<style scoped lang="scss">

    .home-page{
        .img-main{
            width: 100%;
            img{
                width: 100%;
            }
        }

        .desc-container{
            .desc-item{
                line-height: 30px;
            }
        }
    }


</style>