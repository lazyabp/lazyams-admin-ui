<template>
  <div>
    <el-input v-model="value">
      <span v-if="isImage && value" slot="prepend" class="image-review">
        <a :href="value" target="_blank">
          <img :src="value" alt="Preview" style="max-width: 28px; max-height: 28px;">
        </a>
      </span>
      <el-button slot="append" size="mini" type="primary" @click="dialogVisible = true">
        上传文件
      </el-button>
    </el-input>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :modal="false"
      width="30%"
      @close="dialogVisible = false"
    >
      <el-upload
        :multiple="false"
        :show-file-list="false"
        :on-success="handleSuccess"
        :accept="accept"
        :action="fileUploadUrl"
        :headers="headers"
        class="image-uploader"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isImage: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '上传文件'
    },
    accept: {
      type: String,
      default: '.jpg,.jpeg,.png,.gif,.webp'
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      fileUploadUrl: `${process.env.VUE_APP_BASE_API}/api/File/Upload`,
      headers: {
        Authorization: `Bearer ${this.$store.getters.token}`
      }
    }
  },
  methods: {
    handleSuccess(response) {
      const url = response.data.domain + response.data.filePath
      this.$emit('input', url)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.image-review {
  display: inline-block;
  width: 30px;
  vertical-align: middle;
}
</style>
