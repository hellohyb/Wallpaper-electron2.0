// src/stores/messageStore.js
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    deleteImgBox:false,
    showEdit:false,
    deleteNum:[],
    suppressClick:false,
  }),
  actions: {
    updateDelState(states){
      this.deleteImgBox = states
    },
    // updateDeleteNum(num){
    //   this.deleteNum = num
    // },
    showEdits(state){
      this.showEdit = state
    }
  },
});
