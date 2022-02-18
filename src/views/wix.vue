<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-refresh" @click="loadListPager" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate" />
    </div>

    <el-table
      :key="tableKey"
      v-loading="tableListLoading"
      :data="tableList"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :default-sort="{prop: 'lastUpdateDateTime', order: 'descending'}"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="tableOrder"
    >
      <el-table-column prop="wixTitle" label="Title" sortable width="180" />
      <el-table-column prop="wixAuthor" label="Author" sortable width="180" />
      <el-table-column prop="wixTypesetting" label="Editor" sortable width="180" />
      <el-table-column prop="wixPublishing" label="Publisher" sortable width="180" />
      <el-table-column prop="wixReleaseDate" label="Date" sortable width="180" />
      <el-table-column prop="wixSummary" label="Abstract" sortable width="180" />
      <el-table-column prop="lastUpdateDateTime" label="Last Update Date" sortable width="180" />
      <el-table-column label="Operate" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button v-if="row.status!='deleted'" type="danger" icon="el-icon-delete" @click="handleDelete(row,$index)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableQuery.total>0" style=" margin-top: 0px;" :total="tableQuery.total" :page.sync="tableQuery.currentPage" :limit.sync="tableQuery.pageSize" @pagination="paginationPager" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Title" prop="wixTitle">
              <el-input ref="roleName" v-model="temp.wixTitle" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Link" prop="wixLink">
              <el-input v-model="temp.wixLink" maxlength="255" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Author" prop="wixAuthor">
              <el-input ref="roleName" v-model="temp.wixAuthor" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Editor" prop="wixTypesetting">
              <el-input ref="roleName" v-model="temp.wixTypesetting" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Publisher" prop="wixPublishing">
              <el-input v-model="temp.wixPublishing" maxlength="255" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Date" prop="wixReleaseDate">
              <el-date-picker v-model="temp.wixReleaseDate" value-format="yyyy-MM-dd" type="date" placeholder="select date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Abstract" prop="wixSummary">
              <el-input v-model="temp.wixSummary" maxlength="255" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Content" prop="wixContent">
              <el-input v-model="temp.wixContent" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button :loading="formLoading" type="primary" @click="formSave()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { wixGet, wixFindList, wixCreate, wixUpdate, wixDelete } from '@/api/wix'
import Pagination from '@/components/Pagination'

export default {
  name: 'WixFile',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      tableList: [],
      tableListLoading: true,
      tableQuery: {
        total: 100,
        currentPage: 1,
        pageSize: 10
      },

      dialogFormVisible: false,
      formLoading: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Add'
      },
      rules: {
        wixTitle: [{ required: true, message: 'The title can not be blank', trigger: 'blur' }],
        wixAuthor: [{ required: true, message: 'Author cannot be empty', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        wixTitle: undefined,
        wixAuthor: undefined,
        wixTypesetting: undefined,
        wixPublishing: undefined,
        wixLink: undefined,
        wixReleaseDate: undefined,
        wixSummary: undefined,
        wixContent: undefined
      }
    }
  },
  created() {
    this.loadListPager()
  },
  methods: {
    loadListPager() {
      wixFindList({ 'id': 10086, 'name': 'zhangsan' }).then(response => {
        this.list = response.data.items
        this.tableQuery.total = this.list.length
        this.tableListLoading = false
        this.paginationPager()
      })
    },
    tableOrder(column, prop, order) {
      this.list.sort(function(a, b) {
        var nameA = a[column.prop].toUpperCase() // ignore upper and lowercase
        var nameB = b[column.prop].toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return column.order === 'ascending' ? -1 : 1
        }
        if (nameA > nameB) {
          return column.order === 'ascending' ? 1 : -1
        }
        return 0
      })
    },
    paginationPager() {
      this.tableList = this.list.slice(((this.tableQuery.currentPage - 1) * this.tableQuery.pageSize), (this.tableQuery.currentPage * this.tableQuery.pageSize))
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        wixTitle: '',
        wixAuthor: '',
        wixTypesetting: '',
        wixPublishing: '',
        wixLink: '',
        wixReleaseDate: '',
        wixSummary: '',
        wixContent: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    formSave() {
      if (this.temp.id) {
        wixUpdate(this.temp).then(res => {
          this.$message({ message: 'Successful operation', type: 'success' })
          this.dialogFormVisible = false
          this.loadListPager()
        })
      } else {
        wixCreate(this.temp).then(res => {
          this.$message({ message: 'Successful operation', type: 'success' })
          this.dialogFormVisible = false
          this.loadListPager()
        })
      }
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      this.$confirm('Are you sure you want to delete?', 'Confirm information', { distinguishCancelAndClose: true, confirmButtonText: '保存', cancelButtonText: '取消' }).then(() => {
        wixDelete(row.id).then(res => {
          this.$message({ message: 'Successful operation', type: 'success' })
          this.loadListPager()
        })
      })
    }

  }
}
</script>
