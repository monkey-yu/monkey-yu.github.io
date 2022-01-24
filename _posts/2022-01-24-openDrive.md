---

layout:     post
title:      "openDrive概述"
date:       2022-01-24 14:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - openDrive
---

#### 1. openDrive 概述

openDRIVE的全称是 ASAM openDRIVE。

openDRIVE是以可扩展标记语言XML为基础，文件后缀为xodr格式的描述道路及道路网的通用标准。存储在openDRIVE文件中的数据描述了道路的几何形状以及沿线的特征并且定义了可以影响交通逻辑的交通标志以及道路基础设施，例如车道和信号灯。

openDRIVE中描述的路网可以是人工生成的或者来自于真实世界的。

openDRIVE的主要目的是提供可用于仿真的路网描述，并使这些路网描述之间可以进行交换。

openDRIVE结构图如下：

![](/img/post_img/opendrive/xodr结构图.png)

OpenDRIVE包含 **Coordinate systems(坐标系)**、**Roads(道路)**、 **Lanes(车道)**、**Junctions(交叉口)**这些主要元素。

#### 2. Coordinate systems(坐标系)

这里介绍openDRIVE用到的三种坐标系：**惯性坐标系**、**参考性坐标系**、**局部坐标系**。

##### 惯性坐标系

根据ISO 8855惯性坐标系是右手坐标系，其轴的指向方向如下

 x轴 ⇒ 右方 

y轴 ⇒ 上方 

z轴 ⇒ 指向绘图平面外

##### 参考性坐标系

参考性坐标系同样也是右手坐标系，应用于道路参考线。

 s 坐标沿参考线，以m为单位，由道路参考线的起点开始测量，在xy平面中计算（也就是说，这里不考虑道路的高程剖面）

 t 侧面，在惯性x/y平面里正向向左 

h 在右手坐标系中垂直于st平面。

##### 局部坐标系

局部u/v/z轴坐标系 对局部坐标系的查找与定位将相对于参考线坐标系来进行，具体方法为对原点、原点的航向角/偏航角、横摆角/翻滚角和俯仰角的旋转角度及它们之间的关系进行详细说明。 

根据ISO 8855局部坐标系是右手坐标系，其轴的指向方向如下。以下内容适用于非旋转坐标系： 

u 向前匹配 s 

v 向左匹配 t 

z 向上匹配 h

**这三种坐标系相互作用成为OpenDRIVE的重要组成部分**。

#### 3. Roads(道路)

地图是由一条条道路连接起来的。路网在 **openDRIVE**中用 `<road>`元素来表示。

Roads的一些特点：

每条道路都沿一条道路参考线延伸。

1. 一条道路必须拥有至少一条宽度大于0的车道。
2. 每条道路由一个或多个 `<road>`元素描述。一个 `<road>`元素可以覆盖一条长路、交叉口之间较短的路、或甚至多条道路。
3. 只有在道路的属性不能在先前 `<road>`元素中得到描述，或者需要一个交叉口的情况下，才应开始一个新的 `<road>`元素。

如下例子：

道路遇到交叉口：**junction="94"**

```xml
<road id="116" junction="94" length="42.977105930706365" name="Road(116)">
    <link>
      <predecessor contactPoint="start" elementId="39" elementType="road" />
      <successor contactPoint="end" elementId="1" elementType="road" />
    </link>
  	<planView>
      <geometry hdg="4.9825421809856376" length="3.96624330297226" s="0" x="-63.389297440907946" 			y="30.7690495382862">
        <paramPoly3 aU="0" aV="0" bU="3.9657600531777994" bV="1.8873791418627661E-15" cU="0.0031981585370135512" cV="-0.19520713673109125" dU="-0.0032150418983318829" dV="0.18363516910297839" pRange="normalized" />
        // 道路参考线几何元素的几种形式,下面有解释
      </geometry>
    </planView>
    ...
</road>
```

定义connecting road时是在<lane>的父元素下<link>的子元素中进行定义。所需要的属性为：

- Predecessor：表示与当前车道相连前面的路

- Successor：表示与当前车道相连后面的路。

  

下图展示了定义道路参考线几何元素的五种可能方式：

- 直线（Line）

- 曲率呈线性变化的螺旋线或回旋曲线 (sprial)

- 具有恒定曲率的弧线（圆弧）(Arc)

- 三次多项式 (poly3)

- 参数化的三次多项式 (paramPoly3)

  ![road-desc](/img/post_img/opendrive/road-desc.jpeg)

#### 4. Lanes(车道)

接下来了解道路里的元素 **车道**。

1. 在openDRIVE中，所有道路都包含了车道。每条道路必须拥有至少一条宽度大于0的车道，并且每条道路的车道数量不受限制。

2. 需要使用中心车道对openDRIVE中的车道进行定义和描述。中心车道没有宽度，并被作用车道编号的参考，自身的车道编号为0。对其他车道的编号以中心车道为出发点，车道编号向右呈降序，也就是朝负t方向；向左呈升序，也就是正t方向。

3. 车道的特点：

   1）<lanes> 车道 <laneSection> 车道组

   2）属性：

   - s:起始位置的s坐标 

   - singleSide:ture false 车道段元素仅对一侧有效（左、中或右），这将取决于子元素
   - left 左车道、 center 中心车道、right 右车道
   - 带有正ID的车道在中心车道的左侧，而带有负ID的车道则在中心车道的右侧。

   - 每个车道段必须包含至少一个<right>或<left>元素。
   -  必须给每个s坐标定义一个<center>元素。
   - 每个车道段都可包含一个<center>元素。
   - 为了能够更好地确认方向，车道应按照降序ID按从左到右的顺序排列。

   例子：

   ```xml
   <lanes>
         <laneOffset a="0" b="0" c="0" d="0" s="0" />
         <laneSection s="0" singleSide="false">
           <left>
             <lane id="3" level="false" type="driving">  // 以中心车道为基准的左三车道
               ... 
             </lane>
             <lane id="2" level="false" type="driving">  // 以中心车道为基准的左二车道
               ...
             </lane>
             <lane id="1" level="false" type="none">    // 以中心车道为基准的左一车道
            		...
             </lane>
           </left>
           <center>
             <lane id="0" level="false" type="none">   // 中心车道
               <roadMark color="yellow" height="0" laneChange="both" material="" type="none" weight="standard" width="0.15" sOffset="0" />
             </lane>
           </center>
           <right>
             <lane id="-1" level="false" type="none">  // 以中心车道为基准的右一车道
               ...
             </lane>
             <lane id="-2" level="false" type="driving"> // 以中心车道为基准的右二车道
              	...
             </lane>
             <lane id="-3" level="false" type="driving">  // 以中心车道为基准的右三车道，驾驶车道，不保持在同一水平面
               <width a="3.3747901255819306" b="-1.8533089401837411E-09" c="-4.4314201530833731E-11" d="2.3546454410226982E-13" sOffset="0" />
               <roadMark color="white" height="0" laneChange="none" material="" type="solid" weight="standard" width="0.15" sOffset="0" />
               <height inner="0" outer="0" sOffset="0" />
               <height inner="0" outer="0" sOffset="125.46602741385638" />
             </lane>
           </right>
         </laneSection>
       </lanes>
   ```

left的子元素<lane>的属性有：


- id: 该车道的编号，延参考线坐标系的t方向增加
- type:该车道线的种类（驾驶车道，停车道，边界线）
- level:道路是否保持在同一水平面上

#### 5. Junctions(交叉口)

在OpenDRIVE中交叉口是用**Junctions**来表示的。

1. 交叉口指的是三条或更多道路相聚的地方，与其相关的道路被分为两种类型。含有驶向交叉口车道的道路称为来路。

	2. 联接道路:呈现了穿过交叉口的路径
	2. 交叉口组是通过 <junctionGroup> 元素来描述的。所属交叉口组的交叉口由 <junctionReference> 元素来详细说明。

例子：

```xml
<junction id="736" name="Junction(736)">
    <connection connectingRoad="737" contactPoint="start" id="0" incomingRoad="69">
      <laneLink from="-1" to="-1" />
      <laneLink from="-2" to="-2" />
    </connection>
    <connection connectingRoad="741" contactPoint="start" id="1" incomingRoad="69">
      <laneLink from="-2" to="-1" />
    </connection>
    <connection connectingRoad="744" contactPoint="start" id="2" incomingRoad="203">
      <laneLink from="-1" to="-1" />
    </connection>
  </junction>
```

OpenDRIVE提供了两种道路的连接方式：connecting road和junction。

用一个例子来说明connecting road和junction的连接：

![example](/img/post_img/opendrive/example.jpg)

对于Road 10来说，其车道-1和车道-2的连接关系为：

![road-1](/img/post_img/opendrive/road-1.jpeg)

对于Road30来说，其与Road 10和Road 70先后相连接，用connecting road的表达方式来表达这段路的连接即为：

![road-2](/img/post_img/opendrive/road-2.jpeg)

对于Road 10与Road 20，Road 30和Road 40的交界处的junction，其表示为：

![road-3](/img/post_img/opendrive/road-3.jpeg)

通过这样的两种道路连接方式，可以将道路进行连接。



#### 6. ASAM OpenDRIVE 、ASAM OpenCRG、ASAM OpenSCENARIO

ASAM OpenDRIVE为路网的静态描述定义了一种存储格式。

通过与ASAM OpenCRG结合使用，可以将非常详细的路面描述添加至路网当中。

OpenDRIVE和ASAM OpenCRG仅包含静态内容，若要添加动态内容，则需要使用ASAM OpenSCENARIO。

三个标准的结合则提供包含静态和动态内容、由场景驱动的对交通模拟的描述。

![asam](/img/post_img/opendrive/asam.jpeg)



------

参考openDRIVE文件： /static/opendrive/guomaoqiao-4.xodr

参考链接： https://zhuanlan.zhihu.com/p/352422886

​					https://cloud.tencent.com/developer/article/1776648