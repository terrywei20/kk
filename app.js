const defaults={
skillName:"lazy-sheep-illustration",
displayName:"懒羊羊画图 Skill",
description:"以固定的懒羊羊三视图为角色基准，将视频文案稳定转译为圆润、干净、可用于动画剪辑的插画画面。",
styleBackground:"扁平极简卡通风格，粗黑描边，圆润软萌，低细节，柔和暖色调。默认纯白或浅灰背景；需要场景时保持背景简洁，主体与背景分层清楚。",
mustHave:"• 默认输出 16:9 横版画面\n• 角色必须完整入镜，不裁切头顶、羊角或脚部\n• 优先使用正面、侧面、背面三视图作为一致性参考\n• 黄口水巾、白色卷毛、焦糖棕羊角必须保留\n• 画面只出现文案明确要求的角色和物品",
ipConstraints:"懒羊羊是本站固定使用的核心 IP。每次生成都必须沿用参考图的头身比例、白色蓬松卷毛、奶油杏色脸部、焦糖棕小羊角、黑色椭圆眼睛、弯曲微笑嘴和明黄色方形口水巾。",
fourViewRules:"生成图片前必须读取三视图参考。正面镜头参考正面造型，侧面镜头参考侧面轮廓，背面镜头参考背面毛发与口水巾结构。多角色或特殊动作也不能改变懒羊羊的基础比例和配色。",
appearance:"三头身比例，头部约占整体高度 55%；白色蓬松羊毛包裹头部和身体；脸部为奶油杏色；两侧露出小巧焦糖棕羊角；佩戴明黄色方形口水巾；四肢短小，无尾巴。",
actionRules:"动作夸张但结构清楚，优先使用大轮廓和明确手势表达情绪。坐、蹲、跑、托腮、举手机等动作不得改变角色体型。表情保持呆萌、憨厚、温和，可按文案加入惊讶、委屈、得意等变化。",
negativeRules:"禁止写实毛发、复杂光影、纤细四肢、长脖子、尖锐五官、额外尾巴、错色口水巾、巨大羊角、改变头身比例、添加未要求的文字、水印或品牌标志。",
promptTemplate:"请根据「{{画面描述}}」生成一张懒羊羊主题插画。严格参考三视图中的角色造型与配色：白色卷毛、奶油杏色脸部、焦糖棕小羊角、明黄色方形口水巾、粗黑描边、圆润三头身。画风为扁平极简卡通，画面比例 {{比例}}，视角为 {{视角}}，背景为 {{背景}}。角色动作：{{动作}}；情绪：{{情绪}}。保持主体完整、轮廓清晰、画面干净，不添加无关人物、文字、水印或标志。",
qaChecklist:"□ 懒羊羊头身比例与参考图一致\n□ 白色卷毛、杏色脸、棕色羊角、黄色口水巾颜色正确\n□ 耳朵小巧，羊角大小不变，角色没有尾巴\n□ 主体完整入镜，没有裁切或遮挡关键特征\n□ 动作和表情准确表达文案含义\n□ 背景简洁，没有无关人物、文字、水印或标志\n□ 画面比例、视角、远近景符合提示词",
listTitle:"懒羊羊画图",
listSubtitle:"让每一张动画配图，都保持同一个懒羊羊",
listPoints:"固定三视图角色一致性\n适配 16:9 视频动画配图\n内置提示词模板与禁用项\n生成前后自动执行 QA 检查"
};
const storageKey="lazy-sheep-skill-studio-data";
const imageKey="lazy-sheep-skill-studio-image";
let state={...defaults};
let imageData=window.LAZY_SHEEP_IMAGE;
const tabMeta={entry:["入口","使用说明"],tuning:["调参","核心规则"],ip:["IP","角色约束"],style:["画风背景","视觉规范"],prompt:["提示词","生图模板"],qa:["QA","质量检查"],listing:["列表文案","展示信息"]};
function compilePrompt(){return state.promptTemplate.replace("{{画面描述}}","懒羊羊坐在书桌前低头玩手机").replace("{{比例}}","16:9").replace("{{视角}}","微微侧视").replace("{{背景}}","干净温暖的卧室").replace("{{动作}}","双手捧着手机，身体微微前倾").replace("{{情绪}}","专注又有一点得意")}
function render(){
document.querySelectorAll("[data-key]").forEach(el=>{el.value=state[el.dataset.key]||""});
document.querySelectorAll("[data-display]").forEach(el=>{el.textContent=state[el.dataset.display]||""});
document.querySelectorAll(".js-ip-image").forEach(img=>{img.src=imageData});
const prompt=compilePrompt();document.querySelector("#compiledPrompt").textContent=prompt;document.querySelector("#promptLength").textContent=`${prompt.length} 字`;
document.querySelector("#listPointsPreview").innerHTML=state.listPoints.split("\n").filter(Boolean).map(x=>`<li>${escapeHtml(x)}</li>`).join("")
}
function escapeHtml(text){const div=document.createElement("div");div.textContent=text;return div.innerHTML}
function showToast(message){const toast=document.querySelector("#toast");toast.querySelector("b").textContent=message;toast.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
function selectTab(id){
document.querySelectorAll("[data-tab]").forEach(btn=>{const on=btn.dataset.tab===id;btn.classList.toggle("active",on);btn.setAttribute("aria-selected",String(on))});
document.querySelectorAll("[data-panel]").forEach(panel=>panel.classList.toggle("active",panel.dataset.panel===id));
document.querySelector("#sectionTitle").textContent=tabMeta[id][0];document.querySelector("#sectionHint").textContent=tabMeta[id][1]
}
function validate(){
const required=[["Skill 名称",state.skillName],["展示名称",state.displayName],["IP 形象约束",state.ipConstraints],["提示词模板",state.promptTemplate],["QA 清单",state.qaChecklist]];
const missing=required.filter(x=>!x[1].trim());const card=document.querySelector("#statusCard");
if(missing.length){card.classList.add("invalid");document.querySelector("#statusTitle").textContent="发现配置问题";document.querySelector("#statusDetail").textContent=`缺少：${missing.map(x=>x[0]).join("、")}`;showToast("校验未通过，请补全必填项");return false}
card.classList.remove("invalid");document.querySelector("#statusTitle").textContent="Skill is valid";document.querySelector("#statusDetail").textContent=`${new Date().toLocaleTimeString("zh-CN",{hour12:false})} 校验通过 · 7 个模块完整`;showToast("全部规则校验通过");return true
}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));localStorage.setItem(imageKey,imageData);showToast("已保存到当前浏览器")}catch{localStorage.setItem(storageKey,JSON.stringify(state));showToast("文字已保存，图片文件较大未缓存")}}
function reload(){const saved=localStorage.getItem(storageKey);state=saved?JSON.parse(saved):{...defaults};imageData=localStorage.getItem(imageKey)||window.LAZY_SHEEP_IMAGE;render();showToast(saved?"已载入上次保存的内容":"已恢复默认内容")}
async function packageSkill(){
if(!validate())return;
const zip=new JSZip();const name=state.skillName||"lazy-sheep-skill";
zip.file("SKILL.md",`---\nname: ${name}\ndescription: ${state.description.replace(/\n/g," ")}\n---\n\n# ${state.displayName}\n\n## 工作流\n1. 读取懒羊羊三视图参考。\n2. 读取 IP 与画风规范。\n3. 按提示词模板组装完整提示词。\n4. 生成后逐项执行 QA。\n\n## 必须遵循\n${state.mustHave}\n`);
zip.file("references/lazy-sheep-ip.md",`# 懒羊羊 IP 规范\n\n${state.ipConstraints}\n\n## 三视图规则\n${state.fourViewRules}\n\n## 外形\n${state.appearance}\n\n## 动作\n${state.actionRules}\n\n## 禁用项\n${state.negativeRules}\n`);
zip.file("references/style-dna.md",`# 画风与背景\n\n${state.styleBackground}\n`);
zip.file("references/prompt-template.md",`# 生图提示词模板\n\n${state.promptTemplate}\n\n## 示例\n${compilePrompt()}\n`);
zip.file("references/qa-checklist.md",`# QA\n\n${state.qaChecklist}\n`);
zip.file("references/list-copy.md",`# 列表文案\n\n标题：${state.listTitle}\n\n副标题：${state.listSubtitle}\n\n${state.listPoints}\n`);
const parts=imageData.split(",");if(parts[1])zip.file("assets/reference/lazy-sheep-three-view.jpg",parts[1],{base64:true});
const blob=await zip.generateAsync({type:"blob"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${name}.zip`;a.click();URL.revokeObjectURL(url);showToast("Skill ZIP 已打包下载")
}
document.querySelectorAll("[data-tab]").forEach(btn=>btn.addEventListener("click",()=>selectTab(btn.dataset.tab)));
document.querySelectorAll(".jump-button").forEach(btn=>btn.addEventListener("click",()=>selectTab(btn.dataset.jump)));
document.querySelectorAll("[data-key]").forEach(el=>el.addEventListener("input",e=>{state[e.target.dataset.key]=e.target.value;render()}));
document.querySelector("#replaceButton").addEventListener("click",()=>document.querySelector("#imageInput").click());
document.querySelector("#imageInput").addEventListener("change",event=>{const file=event.target.files[0];if(!file||!file.type.startsWith("image/"))return;const reader=new FileReader();reader.onload=()=>{imageData=reader.result;render();showToast("参考图已替换")};reader.readAsDataURL(file)});
document.querySelector("#reloadButton").addEventListener("click",reload);
document.querySelector("#saveButton").addEventListener("click",save);
document.querySelector("#validateButton").addEventListener("click",validate);
document.querySelector("#validateAgainButton").addEventListener("click",validate);
document.querySelector("#packageButton").addEventListener("click",packageSkill);
document.querySelector("#packageAgainButton").addEventListener("click",packageSkill);
document.querySelector("#copyPromptButton").addEventListener("click",async()=>{await navigator.clipboard.writeText(compilePrompt());showToast("示例提示词已复制")});
render();
