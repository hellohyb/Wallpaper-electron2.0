import { useMessageStore } from '@renderer/stores/messageStore'
import pinia from "@renderer/stores/pinia";
import { watch } from 'vue';
const messageStore:any = useMessageStore(pinia);
let selectDiv:any = null
let startX = 0;
let startY = 0;
let imgboxRect
let domValues
let itemList:any = []
watch(() => messageStore.showEdit,(_new,_old) => {
    if(_new === false){
        for(let i = 0; i < itemList.length; i++){
            clearSelect(itemList[i])
        }
    }
})
export default function createSelectBox(domValue,itemss){
    domValue.addEventListener("mousedown",(event) => {
        if (event.target !== event.currentTarget) {
            // 子元素触发的事件，不处理
            return;
          }
        domValues = domValue
        itemList = itemss
        imgboxRect = domValue.getBoundingClientRect();
        if(!selectDiv){
            selectDiv = document.createElement("div");
        }
        // 鼠标按下的起始位置，减去 imgbox 的边界位置，并考虑滚动偏移量
        startX = event.clientX - imgboxRect.left + domValue.scrollLeft;
        startY = event.clientY - imgboxRect.top + domValue.scrollTop;
        selectDiv.style.pointerEvents = "none"
        selectDiv.style.border = "2px solid #409EFF"
        selectDiv.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
        selectDiv.style.position = "absolute"
        selectDiv.style.zIndex = 999
        selectDiv.style.left = `${startX}px`;
        selectDiv.style.top = `${startY}px`;
        domValue.appendChild(selectDiv)
        document.addEventListener("mousemove",mousemoving)
        document.addEventListener("mouseup",mouseuping)
    })
}
const mousemoving = (event) => {
     // 当前鼠标位置，考虑滚动偏移量
    const currentX = Math.max(
        0,
        Math.min(event.clientX - imgboxRect.left + domValues.scrollLeft, domValues.scrollWidth)
    );
    const currentY = Math.max(
        0,
        Math.min(event.clientY - imgboxRect.top + domValues.scrollTop, domValues.scrollHeight)
    );
      // 计算宽高和方向
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);
      const left = Math.min(currentX, startX);
      const top = Math.min(currentY, startY);
      // 设置选框样式
      selectDiv.style.width = `${width}px`;
      selectDiv.style.height = `${height}px`;
      selectDiv.style.left = `${left}px`;
      selectDiv.style.top = `${top}px`;
      messageStore.deleteNum = []
      for(let i = 0; i < itemList.length; i++){
            clearSelect(itemList[i])
        }
      for(let i = 0; i < itemList.length; i++){
        if (isElementIntersecting(selectDiv, itemList[i])) {
            messageStore.showEdits(true)
            messageStore.deleteNum.push(itemList[i].__vueParentComponent.props.imgInfo)
            isSelect(itemList[i])
            }
        }
}
const mouseuping = () => {
    // 当鼠标松开时，阻止点击事件
    messageStore.suppressClick = true; // 标记阻止点击事件
    setTimeout(() => messageStore.suppressClick = false, 0); // 重置标志位，确保只影响一次
    if(selectDiv){
        selectDiv.remove()
        selectDiv = null
    }
    document.removeEventListener("mousemove",mousemoving)
    document.removeEventListener('mouseup', mouseuping);
}

const isElementIntersecting = (selectionBox, element) => {
    const selectionRect = selectionBox.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
  
    return !(
      elementRect.right < selectionRect.left ||
      elementRect.left > selectionRect.right ||
      elementRect.bottom < selectionRect.top ||
      elementRect.top > selectionRect.bottom
    );
}
// document.addEventListener("click",() => {
//     for(let i = 0; i < itemList.length; i++){
//         clearSelect(itemList[i])
//     }
// })
const isSelect = (element) => {
    element.style.border = "3px solid red"
}
const clearSelect = (element) => {
    element.style.border = "none"
}
