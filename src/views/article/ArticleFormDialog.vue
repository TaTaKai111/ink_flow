<template>
  <!-- 新增 / 编辑文章弹窗 -->
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑文章' : '新增文章'"
    width="640px"
    top="8vh"
    @update:model-value="emit('update:visible', $event)"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="article-form"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" maxlength="60" show-word-limit />
      </el-form-item>

      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="标签" prop="tagIds">
        <el-select
          v-model="form.tagIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择标签（可多选）"
          style="width: 100%"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          >
            <span class="tag-option" :style="{ backgroundColor: tag.color }" />
            {{ tag.name }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio value="published">已发布</el-radio>
          <el-radio value="draft">草稿</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="8"
          resize="none"
          placeholder="请输入文章正文内容（演示用文本编辑器）"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { createArticle, updateArticle } from '@/api/article'

const props = defineProps({
  // 弹窗是否可见
  visible: {
    type: Boolean,
    default: false,
  },
  // 编辑的文章对象（为空表示新增）
  article: {
    type: Object,
    default: null,
  },
  // 分类选项
  categories: {
    type: Array,
    default: () => [],
  },
  // 标签选项
  tags: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:visible', 'saved'])

const formRef = ref()
const submitting = ref(false)
const isEdit = ref(false)

// 表单初始值
const emptyForm = () => ({
  title: '',
  categoryId: '',
  tagIds: [],
  status: 'draft',
  content: '',
})

const form = reactive(emptyForm())

// 校验规则：标题必填、分类必选
const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
}

// 弹窗打开时根据编辑/新增模式填充表单
watch(
  () => props.visible,
  visible => {
    if (!visible) return
    isEdit.value = !!props.article
    Object.assign(form, emptyForm())
    if (props.article) {
      Object.assign(form, {
        title: props.article.title,
        categoryId: props.article.categoryId,
        tagIds: [...(props.article.tagIds || [])],
        status: props.article.status,
        content: props.article.content,
      })
    }
    nextTick(() => formRef.value?.clearValidate())
  },
)

// 关闭时重置表单
function handleClosed() {
  formRef.value?.resetFields()
  Object.assign(form, emptyForm())
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateArticle(props.article.id, { ...form })
      ElMessage.success('文章更新成功')
    } else {
      await createArticle({ ...form })
      ElMessage.success('文章新增成功')
    }
    emit('update:visible', false)
    emit('saved')
  } catch (error) {
    console.error('文章保存失败：', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.article-form {
  padding-right: 12px;

  .tag-option {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 50%;
    vertical-align: 1px;
  }
}
</style>
