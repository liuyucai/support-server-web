<template>
  <div id="app">
    <frontboard :config="config"/>
  </div>
</template>

<script>

  export default {
    name: 'App',
    components: {
    },

    data() {
      return {
        config:{
          name:"KeVisual",//系统名称
          img:require("@/assets/images/logo.png"),//系统图片
          menu:[
            {
              menuName:"组织管理",
              id:1,
              isParent:true,
              child:[
                {
                  menuName:"用户管理",
                  id:2,
                  isParent:false,
                  path:"/user",
                },
                {
                  menuName:"角色管理",
                  id:3,
                  isParent:false,
                  path:"/role",
                }, {
                  menuName:"机构管理",
                  id:4,
                  isParent:false,
                  path:"/org",
                }
              ]
            },
            {
              menuName:"系统设置",
              id:5,
              isParent:true,
              child:[
                {
                  menuName:"菜单管理",
                  id:14,
                  isParent:false,
                  path:"/menu",
                }
              ]
            }
          ],
          homePageTab:{
            name:"首页",//名称
            route:"/login", //首页路由
            defaultOpen:true,  //首页tab是否默认打开,默认false
            closableIfOnly:false,  //如果只有首页tab打开时，首页tab是否可关闭,默认：false
            cleanAllTabDefaultOpen:true,   //当关闭所有tab后是否默认打开首页tab,默认false，如果closableIfOnly为true时，不生效
          }
        }
      }
    },
  }
</script>

<style>
  body{
    padding: 0;
    margin: 0;
  }

  ::-webkit-scrollbar {/*滚动条整体样式*/
    /*width: 8px; !*高宽分别对应横竖滚动条的尺寸*!*/
    /*border-radius: 5px;*/
    width: 12px;
    height: 0px
  }

  ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/

    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 7px;
    background-color: #c2c2c2;

  }

  ::-webkit-scrollbar-track {/*滚动条里面轨道*/
    /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
    /*background: #acffef;*/
  }
</style>
