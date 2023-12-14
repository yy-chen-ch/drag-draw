<script setup>

import { Graph } from "@antv/x6"
import { Transform } from '@antv/x6-plugin-transform'
import { Export } from '@antv/x6-plugin-export'
import { onMounted, reactive, ref } from "vue"
import { ElTable, ElMessage } from 'element-plus'

const data = ref([
  { 
    id: 1, 
    describe: "使用前检查砂轮、切割片，如有裂纹、残损、缺口等现象时应禁止使用。",
    vote: "是",
    mark: "否",
    markID: ""
  },
  { 
    id: 2, 
    describe: "检查砂轮切割机的外观，观察是否有明显的划痕、变形或损伤等问题",
    vote: "是",
    mark: "否",
    markID: ""
  },
  { 
    id: 3, 
    describe: "检查电线、插头等电气系统相关部件是否正常",
    vote: "是",
    mark: "否",
    markID: ""

  }
])

const multipleSelection = ref([])
const onChange = (val) => {
  multipleSelection.value = val.map(v => v.id)
  // console.log(val, val.map(v => v.id))
}
const addSelFlag = ref(false)
const addForm = reactive({
  id: null, 
  describe: "",
  vote: false,
  mark: false,
  markID: ""
})
const showAddSel = () => {
  addSelFlag.value = true
}
const resetAddForm = () => {
  addForm.id = ""
  addForm.describe = ""
  addForm.vote = false
  addForm.mark = false
}
const cancelAddSel = () => {
  addSelFlag.value = false
  resetAddForm()
}
const confirmAddSel = () => {
  
  let {id, describe, vote, mark } = addForm
  if(id){

    data.value = data.value.map(v => {
      if(v.id === id){
        v.describe = describe
        v.vote = vote?"是":"否"
        v.mark = mark?"是":"否"
        if(v.markID){
          const edge = graph.getCellById(v.markID)
          const target = graph.getCellById(edge.target.cell)
          // target.attrs.label.text = describe
          target.setAttrs({ label: { text: describe }})
          // console.log(v.markID, edge, target,target.text)
        }
      }
      return v
    })
  }else{
    id = data.value[data.value.length-1].id + 1
    data.value.push({ id, describe, vote: vote?"是":"否", mark: mark?"是":"否", markID:"" })
  }
  
  cancelAddSel()
}
const delSel = () => {
  data.value.forEach(v => {
    if(v.markID && multipleSelection.value.includes(v.id)){
      delMark(v.markID)
    }
  })

  data.value = data.value.filter(v => !multipleSelection.value.includes(v.id))
}

const up = () => {}
const edit = (index) => {
  const { id, describe, vote, mark } = data.value[index]
  addForm.id = id
  addForm.describe = describe
  addForm.vote = vote=="是"
  addForm.mark = mark=="是"
  addSelFlag.value = true
}
const changeMark = (index) => {
  console.log('cancelMark', index)
  data.value = data.value.map((v, id) => {
    if(id === index){
      if(v.mark === '否'){
        v.mark = '是'
        v.markID = addMark(v.describe)
      }else{
        v.mark = '否'
        delMark(v.markID)
        v.markID = ""
      }
      
    }
    return v
  })

}







import bgUrl from '@assets/img/bg.webp'
let graph = null

const initGraph = () => {
  const container = document.getElementById("container")
  graph = new Graph({
    container, 
    width: 400, 
    height: 400, 
    // mousewheel: {
    //     enabled: true,
    //     minScale: 0.2,
    //     maxScale: 4,
    //   }, 
    })
  // graph.drawBackground({
  //   image: bgUrl,
  //   size: { width: '100%', height: '100%' }
  // })

  graph.addNode({
    shape: 'image',
    x: 0,
    y: 0,
    width: 400,
    height: 400,
    imageUrl: bgUrl,
  })

  graph.use(new Export())
  
  graph.use(
      new Transform({
        resizing: true,
      }),
    )

  graph.on('node:mouseenter', ({ node }) => {
    if (node.shape === 'text-block' && !node.hasTool("button-remove")) {
    node.addTools({
      name: 'button-remove',
      args: {
        x: '100%',
        y: 0,
        onClick({ view }) { 
          const edge = graph.getConnectedEdges(view.cell.id)[0]
          // console.log(edge, edge.id)
          delMark(edge.id)
          data.value = data.value.map(v => {
            if(v.markID === edge.id){
              v.markID = ""
              v.mark = '否'
            }
            return v
          })
        }
      }
    });
  }
  })

  graph.on('node:mouseleave', ({ node }) => {
    if (node.hasTool("button-remove")) {
    node.removeTool("button-remove");
  }
  })  
}
const addMark = (text) => {
 
  const source = graph.addNode({
    shape: 'circle',
    x: 180,
    y: 60,
    width: 8,
    height: 8,
    attrs: {
      body: {
        stroke: 'red',
        fill: 'red',
        strokeWidth: 1,
      },
    },
    tools: [
      // {
      //   name: 'button-remove',
      //   args: {
      //     x: '100%',
      //     y: 0,
      //     offset: { x: -10, y: 10 },
      //   },
      // },
    ]
  })

  const target = graph.addNode({
    x: 110,
    y: 110,
    width: 160,
    height: 60,
    shape: 'text-block',
    text: text,
    attrs: {
      body: {
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        strokeWidth: 1,
      }
    },
    // tools: 'button-remove',
    // tools: [
    //   {
    //     name: 'node-editor',
    //     args: {
    //       attrs: {
    //         backgroundColor: '#EFF4FF',
    //       },
    //     },
    //   },
    // ],
  })

  const edge = graph.addEdge({
    source,
    target,
    attrs: {
      line: {
        stroke: 'yellow',
        strokeWidth: 1,
        sourceMarker: { 
          name: ''
        },
        targetMarker: {
          name: ""
        }
      },
    },
  
  })
  
  console.log('add', edge.id, source.id, target.id)
  return edge.id
}
const delMark = (markID) => {
  const edge = graph.removeEdge(markID)
  const { source, target } = edge
  console.log('del', markID, edge)
  graph.removeCells([source.cell, target.cell ])
}

const save = () => {
  const graphData = graph.toJSON()
  localStorage.setItem("graphData", JSON.stringify(graphData))
  localStorage.setItem("tableData", JSON.stringify(data.value))
  ElMessage({  
    message: '保存成功',
    type: 'success'
  })

  // console.log(JSON.stringify(data))
}

const del = (id) => {
  console.log('del png')
}

const loadData = () => {
  // console.log(inputData)
  const graphData = localStorage.getItem('graphData')
  const tableData = localStorage.getItem('tableData')
  graph.fromJSON(JSON.parse(graphData))
  data.value = JSON.parse(tableData)
}

const toPng = () => {
  graph.toPNG((dataUrl) => {
    console.log(dataUrl)
  })
}

onMounted(() => {
  initGraph()
})


</script>

<template>

    <div class="flex pd-16">
      <div class="table  flex-1">
         <div class="flex mb-16">
            <el-button type="primary" @click="showAddSel">新增</el-button>
            <el-button type="danger" @click="delSel">删除</el-button>
         </div>
        <el-table :data="data" border center @selection-change="onChange">
          <el-table-column type="selection" width="40" />
          <el-table-column prop="id" label="序号" width="60" />
          <el-table-column prop="describe" label="描述"  />
          <el-table-column prop="vote" label="否决项" width="80" />
          <el-table-column prop="mark" label="是否标注" width="90" />
          <el-table-column prop="#" label="操作" width="160">
            <template #default="scope">
              <div class="flex">
                <el-button type="primary" size="small" @click="edit(scope.$index)">编辑</el-button>
                <el-button type="danger" size="small" @click="changeMark(scope.$index)">
                  {{ scope.row.mark === '是' ? '取消标注' : '标注' }}
                </el-button>
              </div>
            </template>
          </el-table-column>

        </el-table>

        <el-dialog v-model="addSelFlag" title="添加标注" :before-close="cancelAddSel">
          <el-form :model="addForm">  
            <el-form-item label="描述">
              <el-input v-model="addForm.describe" autocomplete="off" />
            </el-form-item>
            <el-form-item label="否决项">
              <el-switch v-model="addForm.vote"/>
            </el-form-item>
            <!-- <el-form-item label="是否标注">
              <el-switch v-model="addForm.mark" disabled />
            </el-form-item> -->
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelAddSel">取消</el-button>
              <el-button type="primary" @click="confirmAddSel">确认</el-button>
            </span>
          </template>
        </el-dialog>

      </div>
      <div class="img ml-16">
        <div class="flex mb-8">
          <el-button type="primary" @click="up" size="small">点击上传</el-button>
            <el-button type="danger" @click="del" size="small">删除图片</el-button>
            <el-button @click="toPng" size="small">保存图片</el-button>
            <el-button @click="save" size="small">保存</el-button>
            <el-button @click="loadData" size="small">载入数据</el-button>
        </div>
        <div id="container"></div>
      </div>
    </div>

</template>

<style>
foreignObject div{
  font-size: 10px!important;
  line-height: 14px;

}

</style>
