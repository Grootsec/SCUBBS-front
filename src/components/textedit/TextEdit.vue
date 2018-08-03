<template>
<div>
  <Input v-model="postcontent" type="textarea" :autosize="{minRows: 4}" placeholder="输入内容，点击下方的@按钮可@。"></Input>
  <Button type="primary" shape="circle" icon="at" class="button" @click="handleRender"></Button>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList">
      <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
      <template v-else>
          <i-progress v-if="item.showProgress" :percent="item.percentage" hide-info></i-progress>
        </template>
    </div>
    <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png','gif']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" @on-progress="handleProgress"
      :before-upload="handleBeforeUpload" multiple type="drag" action="/api/v1/im/avatarupload" style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
  <div style="position: relative; overflow: hidden;">
    <Tooltip>
      <div slot="content">
        <p>青春广场行使实名制</p>
        <p>瞎bb只能匿名</p>
        <p>表白墙支持匿名</p>
      </div>
      <i-switch v-model="single" size="large" :disabled="disabled" style="position: relative;float: left;">
        <span slot="open" value=1>匿名</span>
        <span slot="close" value=0>实名</span>
      </i-switch>
    </Tooltip>
    <RadioGroup v-model="location" style="position: relative;float: right;">
      <Radio label="全校"></Radio>
      <Radio label="本学院"></Radio>
      <Radio label="本专业"></Radio>
    </RadioGroup>
  </div>
  <Button type="success" long @click="submit">发送</Button>
</div>
</template>

<script>
import AddressSelect from "../AddressSelect/AddressSelect"

export default {
  props: {
    single: {
      type: Boolean,
      default: false
    },
    location: "全校",
    type: {
      default: "0",
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      postcontent: "",
      hiddencontent: "",
      atlist: [],
      value: '',
      addresslist: this.$store.state.addressInfo.address,
      address: "",
      defaultList: [

      ],
      imgName: '',
      visible: false,
      uploadList: [],
      img_list: [

      ]

    }
  },
  methods: {
    handleRender() {
      this.$Modal.confirm({
        render: (h) => {
          return h('AddressSelect', {
            props: {
              address: this.value,
              addresslist: this.$store.state.addressInfo.address,
            },
            on: {
              ontest: (val) => {
                this.value = val;
                let name = "";
                this.$store.state.addressInfo.address.forEach(function(item) {
                  if (item.value === val) {
                    name = item.label;
                  }
                });
                console.log(val);
                this.postcontent += "@" + name + " ";
                this.hiddencontent += "@" + val + " ";
                this.atlist.push({
                  'name': name,
                  'val': val
                });
              }
            }
          })
        }
      })
    },
    submit() {
      console.log(this.submitcontent);
      // todo: 消息推上去
      let anonymous = this.single;
      console.log(anonymous);
      let location = this.location;
      let type = this.type;
      if (anonymous) {
        anonymous = 1;
      } else {
        anonymous = 0;
      }

      this.$http.post("/api/v1/sendMessage", {
          content: this.submitcontent,
          isanonymous: anonymous,
          location: location,
          type: type
        })
        .then(function(res) {
          res = res.body;
          if (res.code == 0) {
            this.$Notice.success({
              title: '成功',
              desc: '短消息发送成功'
            });
            this.submitcontent = '';
          }
        })

    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      console.log(res); // http return content
      file.url = res.thumbnailpath;
      file.name = res.filepath;
      console.log(this.$refs.upload.fileList);
      this.img_list.push({
        "name": file.name,
        "url": file.url
      })
      // this.defaultList.push({'name': file.name, 'url': file.url});
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg ,png 或 gif 格式的图片。'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 5 张图片。'
        });
      }
      return check;
    },
    handleProgress(s) {
      console.log(s)
    }
  },
  components: {
    AddressSelect
  },
  computed: {
    submitcontent() {
      let contentTest = this.postcontent;
      this.atlist.forEach((e) => {
        contentTest = contentTest.replace('@' + e.name + ' ', '@' + e.val + ' ');
      });
      console.log(contentTest);
      let img_list = "";
      this.img_list.forEach((e) => {
        img_list += e.name + " ";
      });
      contentTest += "丨" + img_list;
      return contentTest;
    }
  },
  mounted() {
    //todo: 获取地址信息
    console.log(this.$refs);
    this.uploadList = this.$refs.upload.fileList;
  }
}
</script>

<style scoped>
.button {
  position: relative;
  top: -18px;
  left: 10px;
}

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
