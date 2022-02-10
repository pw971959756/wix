<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-refresh" @click="loadListPager" ></el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate"></el-button>
    </div>

    <el-table :key="tableKey" v-loading="tableListLoading" :data="tableList" @sort-change="tableOrder"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :default-sort = "{prop: 'lastUpdateDateTime', order: 'descending'}"
              border fit highlight-current-row style="width: 100%;">
      <el-table-column prop="wixTitle" label="标题" sortable width="180"></el-table-column>
      <el-table-column prop="wixAuthor" label="作者" sortable width="180"></el-table-column>
      <el-table-column prop="wixTypesetting" label="排版者" sortable width="180"></el-table-column>
      <el-table-column prop="wixPublishing" label="出版社" sortable width="180"></el-table-column>
      <el-table-column prop="wixReleaseDate" label="发表时间" sortable width="180"></el-table-column>
      <el-table-column prop="wixSummary" label="摘要" sortable width="180"></el-table-column>
      <el-table-column prop="lastUpdateDateTime" label="最后更新时间" sortable width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="{row,$index}">
          <el-button type="warning" @click="handleUpdate(row)" icon="el-icon-edit" ></el-button>
          <el-button v-if="row.status!='deleted'" type="danger" @click="handleDelete(row,$index)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination style=" margin-top: 0px;" v-show="tableQuery.total>0" :total="tableQuery.total" :page.sync="tableQuery.currentPage" :limit.sync="tableQuery.pageSize" @pagination="paginationPager" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="wixTitle">
              <el-input v-model="temp.wixTitle" ref="roleName" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="连接地址" prop="wixLink">
              <el-input v-model="temp.wixLink" maxlength="255"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作者" prop="wixAuthor">
              <el-input v-model="temp.wixAuthor" ref="roleName" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排版者" prop="wixTypesetting">
              <el-input v-model="temp.wixTypesetting" ref="roleName" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出版社" prop="wixPublishing">
              <el-input v-model="temp.wixPublishing" maxlength="255"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发表时间" prop="wixReleaseDate">
              <el-date-picker v-model="temp.wixReleaseDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="摘要" prop="wixSummary">
              <el-input v-model="temp.wixSummary" maxlength="255"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="wixContent">
              <el-input type="textarea" v-model="temp.wixContent"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="formLoading" type="primary" @click="formSave()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {wixGet, wixFindList, wixCreate, wixUpdate, wixDelete} from '@/api/wix'
import Pagination from '@/components/Pagination'

export default {
  name: 'wix-file',
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

      dialogFormVisible:false,
      formLoading: false,
      dialogStatus: '',
      textMap: {
        update: '编辑数据',
        create: '新增数据'
      },
      rules: {
        wixTitle: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        wixAuthor: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
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
      wixFindList({ "id": 10086, "name": "zhangsan" }).then(response => {
        this.list = response.data.items
        this.tableQuery.total = this.list.length
        this.tableListLoading = false
        this.paginationPager()
      })
    },
    tableOrder(column, prop, order) {
      this.list.sort(function(a, b) {
        var nameA = a[column.prop].toUpperCase(); // ignore upper and lowercase
        var nameB = b[column.prop].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return column.order === "ascending" ? -1 : 1;
        }
        if (nameA > nameB) {
          return column.order === "ascending" ? 1 : -1;
        }
        return 0;
      });
    },
    paginationPager(){
      this.tableList = this.list.slice(((this.tableQuery.currentPage - 1) * this.tableQuery.pageSize), (this.tableQuery.currentPage * this.tableQuery.pageSize))
    },
    resetTemp() {
      this.temp = {
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
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    formSave() {
      if (this.temp.id) {
        wixUpdate(this.temp).then(res => {
          this.$message({message: '操作成功', type: 'success'})
          this.dialogFormVisible = false
          this.loadListPager()
        })
      } else {
        wixCreate(this.temp).then(res => {
          this.$message({message: '操作成功', type: 'success'})
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
      this.$confirm('是否确定删除?', '确认信息', {distinguishCancelAndClose: true, confirmButtonText: '保存', cancelButtonText: '取消'}).then(() => {
        wixDelete(row.id).then(res => {
          this.$message({message: '操作成功', type: 'success'})
          this.loadListPager()
        })
      })
    }

  }
}
</script>
