## 三阶魔方CFOP法
CFOP方法需要记忆更多的公式，但是用该法完成魔方的速度可以大大加快，是流行的一种进阶方法。

CFOP主要包含四个步骤: <img src="https://ruwix.com/pics/fridrich/00-jumbled.png" width="40" /> 
* 1.CROSS 白十字<img src="https://ruwix.com/pics/fridrich/01-cross.png" width="40" />  
* 2.F2L 下两层<img src="https://ruwix.com/pics/fridrich/02-f2l.png" width="40" />  
* 3.OLL 顶面黄色朝向<img src="https://ruwix.com/pics/fridrich/03-oll.png" width="40" />  
* 4.PLL 顶面黄块位置<img src="https://ruwix.com/pics/fridrich/04-pll.png" width="40" />   

### 第一步：CROSS 完成底层白十字 
与层先法相同

### 第二步：F2L 完成棱边下两层（同时完成层先法第二步+第三步）
方法为一个角一个角插入。对于每个角，将目标位置棱朝向自己。通过旋转目标角块和中间块转化为上层两块位置相连且颜色匹配的基本情况 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-19.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-18.png)。然后用```URU'R'或U'F'UF```转到目标棱。

查看角块和中间块，若：
* 角块和中间块都在上层，且角块白色在侧面
	* 角块与中间块不相邻，顶面异色 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-22.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-23.png) 
	-> 以白面为侧转角块闪开到底层, 转上层中块至角块对面，以白面为侧转角块，与中块对齐
	* 角块与中间块不相邻，顶面同色 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-28.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-29.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-30.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-31.png) 
	-> 以白面为侧转角块闪开到底层，转中块至原角块相邻
	* 角块与中间块相邻 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-26.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-27.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-20.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-21.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-24.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-25.png)
	-> 在保证角块白色在侧面的前提下，将角块与中间块分开。然后根据顶面颜色选择相应方法如上。
	
* 角块和中间块都在上层，且角块白色在顶面
	* 角块与中间块不相邻 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-36.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-37.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-34.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-35.png)-> 转上层使中间块顶面颜色与对应侧面相同，将中间块转到左右侧棱，再将角块转到该棱顶层。
	* 角块与中间块相邻 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-13.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-14.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-32.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-33.png) -> 转动角块使其白面朝向侧面。然后用前述角块白色侧面的方法。

* 角块在上层，中间块在目标棱中层
	* 角块白面朝上，中间块和角块颜色匹配 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-48.png)-> ```(RU'R')(dR'UR)``` *将对齐两块转到上层然后移回正确位置*
	* 角块白面朝上，中间块和角块颜色不匹配 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-12.png) -> ```(RUR'U')(RUR'U')(RUR')```
	* 角块白色朝侧面，中间块和角块一侧颜色匹配 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-44.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-45.png)  ->  ```(UF'UF)(UF'U2F)``` U转上层让白色成为中块侧边，中块上转，再转上层使中块靠近角块，回角块

	* 角块白色朝侧面，中间块和角块一侧颜色不匹配  ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-46.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-47.png) -> ```(UF'U'F)(d'FUF')``` 转上层让白色成为中块侧边，然后中块上转，再转上层使中块远离角块，回角块
 	
* 角块在底层，中间块在上层
	* 角块白面朝下 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-38.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-39.png) -> 只需用层先法第三步归位中间块
	* 角块白面朝侧方 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-40.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-41.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-42.png) ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-43.png)-> 转上层使目标中间块侧面颜色匹配对应侧面，将底面角块沿此侧面上转至上层。若匹配，则直接转到与目标中间块相连。若不匹配，则转开用角块在上层侧面方法。
	
* 角块在底层，中间块在中层
	* 角块白面朝下，且角块和中间块颜色匹配 -> 
	* 角块白面朝下，角块和中间块颜色不匹配 ![img](https://ruwix.com/pics/friedrich/friedrich-f2l-51.png) -> ```(RU'R'URU2R')(URU'R')``` *将这两块转到上层然后用其它方法*	

* 其它情况

### 第三步：OLL 对好顶部黄色块朝向（位置先不管）
该步可以用记忆公式较多的正式法，也可以用简化方法。

#### 简化方法 (2-look OLL)
* OLL1. 对好顶部的十字架，可用与层先法第四步相同方法。也可用以下三公式
	* 一字 <img src="http://www.rubik.com.cn/image/cfop/cross3.gif" width="40" /> ```F (R U R' U') F'```
	* 小拐弯 <img src="http://www.rubik.com.cn/image/cfop/cross21.gif" width="40" /> ```f (R U R' U') f'```
	* 点 <img src="http://www.rubik.com.cn/image/cfop/cross1.gif" width="40" /> ```F (R U R' U') F' f (R U R' U') f'``` *先做一字口诀，再做小拐弯口诀*  
* OLL2. 对好顶层角块朝向 - 7个小鱼公式
	* <img src="http://www.rubik.com.cn/image/cfop/oll27.gif" width="40" /> ```(R' U2 R) (U R' U R)  U2``` (鱼头朝右下，一二两步均以朝鱼头转开始)
	* <img src="http://www.rubik.com.cn/image/cfop/oll26.gif" width="40" /> ```(R U2 R') (U' R U' R')``` (鱼头朝右上，一二两步均以朝鱼头转开始)
	* <img src="http://www.rubik.com.cn/image/cfop/oll24.gif" width="40" /> ```(r U R' U') (r' F R F')``` 
	* <img src="http://www.rubik.com.cn/image/cfop/oll25.gif" width="40" /> ```F'(r U R' U') (r' F R)``` (与上公式类似，将最后F’提前到第一步做)
	* <img src="http://www.rubik.com.cn/image/cfop/oll23.gif" width="40" /> ```(R2 D') (R U'U') (R' D) (R U'U' R)```
	* <img src="http://www.rubik.com.cn/image/cfop/oll21.gif" width="40" /> ```(R U U R' U') (R U R' U') (R U' R')```
	* <img src="http://www.rubik.com.cn/image/cfop/oll22.gif" width="40" /> ```R U'U' (R2' U') (R2 U') R2' U2 R```
	
#### 正式方法 (直接完成顶部十字和角块朝向)
* 最简单不用背七个公式
	* 1 - <img src="http://www.rubik.com.cn/newimage/oll57/O45.gif" width="40" />```F (R U R' U') F'``` (T散：T形，侧黄散布)
	* 2 - <img src="http://www.rubik.com.cn/newimage/oll57/O44.gif" width="40" />```f (R U R' U') f'``` (J左：J形，左侧全黄)
	* 3 - <img src="http://www.rubik.com.cn/newimage/oll57/O43.gif" width="40" />```f' (L' U' L U) f``` (J左镜像)
	* 4 - <img src="http://www.rubik.com.cn/newimage/oll57/O33.gif" width="40" />```(R U R' U') (R' F R F')``` (T分：T形，侧黄上下分)
	* 5 - <img src="http://www.rubik.com.cn/newimage/oll57/O48.gif" width="40" />```F (R U R' U')2 F'``` (43散：3/4块，侧黄没有连三，左侧黄2右侧黄1)
	* 6 - <img src="http://www.rubik.com.cn/newimage/oll57/O47.gif" width="40" />```F' (L' U' L U)2 F``` (43散镜像)
	* 7 - <img src="http://www.rubik.com.cn/newimage/oll57/O51.gif" width="40" />```f(R U R' U')2 f'```(一字左2：横一字，左侧2黄，右侧无黄)
* [其它公式](https://ruwix.com/the-rubiks-cube/advanced-cfop-fridrich/orient-the-last-layer-oll/)

### 第四步：PLL 完成顶块位置
该步也可以用记忆公式较多的正式法，或者用简化方法。

#### 简化方法 (分两步)
* PLL1. 调整顶层角块位置
	* 能找到一条两角同色的边，就把这条边摆在右边 <img src="http://www.rubik.com.cn/image/cfop/pll5.gif" width="40" /> ```x' R2 D2(R' U' R)D2(R' U R') x```
	* 找不到一条两角同色的边，<img src="http://www.rubik.com.cn/image/cfop/pll7_1.gif" width="40" /> ```(R2 U R' U') y (R U R' U')2 (R U R') y' (R U' R2)```
* PLL2. 调整顶层中间块位置
	* 若一边完成，让另三中间快🔄转 <img src="http://www.rubik.com.cn/image/cfop/pll1.gif" width="40" /> ```(RU’)(RURU)(RU’) (R’U’R2)```
	* 若一边完成，让另三中间块🔃转 <img src="http://www.rubik.com.cn/image/cfop/pll2.gif" width="40" /> ```(R2’U) (RUR’U’) (R’U’R’U) R’```
	* 若需要对面交换 <img src="http://www.rubik.com.cn/image/cfop/pll3.gif" width="40" /> ```M2 U M2 U2 M2 U M2```
	* 若需要相邻交换 <img src="http://www.rubik.com.cn/image/cfop/pll4.gif" width="40" /> ```(M2 U) (M2 U) (M' U2 M2 U2 M' U2)```

#### 正式方法
[CFOP公式列表](https://drive.google.com/file/d/0B83M0mP_zW7VdmI0TW90ZHY1ZVE/view)

