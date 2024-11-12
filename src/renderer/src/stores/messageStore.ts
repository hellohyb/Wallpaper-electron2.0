// src/stores/messageStore.js
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    deleteImgBox:false,
  }),
  actions: {
    updateDelState(states){
        this.deleteImgBox = states
    }
  },
});
