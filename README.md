# 文学症候群报告

> 25 道题，测出你的文学病症。仅供娱乐，请勿对号入座。

**[→ 立即测试](https://literary-disease-test.onrender.com)**

---

## 关于这个测试

你在深夜反复读同一段话吗？你觉得自己的悲伤比别人的更有质感吗？你是否相信孤独是一种天赋？

**文学症候群报告**是一份 25 题的心理测试，题目风格参考张爱玲、简嫃、邱妙津等作家的写作气质，测出你的文学症候类型，并匹配与你气质相近的作家。

### 测试结果包含

- **文学关键词**（附英文对照）
- **对应作家**及其生平介绍
- **诊断报告**：你是怎样的人，附带一点刻薄的剖析
- **你们为何相似**：你与该作家的气质共鸣点
- **作家名句**：出自其真实作品

### 12 种结果类型

| 关键词 | 类型 |
|---|---|
| 苍凉如斯 | 张爱玲型 |
| 幽深 | 简嫃型 |
| 迷途之中 | 邱妙津型 |
| 流浪 | 三毛型 |
| 麦地之诗 | 海子型 |
| 金阁之焰 | 三岛由纪夫型 |
| 迷宫 | 博尔赫斯型 |
| 欲 | 杜拉斯型 |
| 困兽 | 卡夫卡型 |
| 他人即地狱 | 萨特型 |
| 恶之花 | 波德莱尔型 |
| 清醒如刀 | 波伏娃型 |

另有一个隐藏彩蛋结果，自己去发现。

---

## 技术栈

- **后端**：Python + Flask
- **数据库**：SQLite（统计各结果分布）
- **前端**：原生 HTML / CSS / JavaScript
- **部署**：Render.com

---

## 本地运行

```bash
git clone https://github.com/Dantalion628/-Literary-Disease-Test.git
cd -Literary-Disease-Test
pip install -r requirements.txt
python app.py
```

打开 http://localhost:5000

---

## 项目结构

```
├── app.py          # Flask 路由
├── quiz_data.py    # 25 道题 + 13 种结果内容
├── scoring.py      # 计分算法
├── database.py     # SQLite 统计
├── templates/      # HTML 模板
└── static/         # CSS + JS
```

---

*仅供娱乐，请勿对号入座。*
