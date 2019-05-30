---
layout:     post
title:      "git命令大全"
date:       2019-05-22 16:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: false
tags:
    - 工具
---

> 此文是看完《廖雪峰的官方网站》git篇后收集总结的命令。

版本库，又名仓库，英文名**repository**。该目录下所有的文件被git管理。 使用`pwd`命令来显示当前目录。使用`git init`把这个目录变成git可以管理的仓库。

新建好的空仓库下，有一个`.git`目录，该目录是用来跟踪版本库的，千万不要手动修改里面的文件。该目录默认是隐藏的，用`ls-ah`可以看见。

 时光机穿梭
 -----

下面是具体的一些命令：

1. 如果`git status`告诉你有文件被修改过，用`git diff`可以查看修改内容。

   ```
   git diff readme.txt
   ```

2. 查看提交信息，git log ，如需显示的有序，可以试试加上`--pretty=oneline`参数。

   ```
   git log
   git log --pretty=oneline
   ```

3. 回退版本：

   ```
   // 回退上一个版本 
   git reset --hard HEAD^
   // 回退上5个版本
   git reset --hard HEAD~5
   ```

4. `git reflog`用来记录你的每一次命令,可以拿到commit 前的commit id。

5. `HEAD`指向的版本就是当前版本，因此，Git允许我们在版本的历史之间穿梭，使用命令`git reset --hard commit_id`。

6. 穿梭前，用`git log`可以查看提交历史，以便确定要回退到哪个版本。

7. 要重返未来，用`git reflog`查看命令历史，以便确定要回到未来的哪个版本。

8. 工作区和暂存区：

   ![git-area](/img/post_img/git/git-area.png)

   Git的版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支`master`，以及指向`master`的一个指针叫`HEAD`。

   1. `git add`把文件添加进去，实际上就是把文件修改添加到暂存区；
   2. `git commit`提交更改，实际上就是把暂存区的所有内容提交到当前分支。

   操作过程：第一次修改 -> `git add` -> 第二次修改 -> `git commit`

   上述这样的过程，第二次修改的文件未被提交到暂存区，直接commit只会提交第一次进入暂存区的修改，如果status查看状态会报如下信息：

   ```
   $ git status
   On branch master
   Changes not staged for commit:
     (use "git add <file>..." to update what will be committed)
     (use "git checkout -- <file>..." to discard changes in working directory)
   
   	modified:   readme.txt
   
   no changes added to commit (use "git add" and/or "git commit -a")
   ```

   正确操作过程：第一次修改 -> `git add` -> 第二次修改 -> `git add` -> `git commit`

9. 修改完代码，未commit之前，想要撤销修改，可以使用：

   ```
   git checkout -- readme.txt
   ```

   命令`git checkout -- readme.txt`意思就是，把`readme.txt`文件在工作区的修改全部撤销，这里有两种情况：

   一种是`readme.txt`自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；

   一种是`readme.txt`已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。

10. 修改代码后，git add到了暂存区，还未commit时，需要把暂存区的修改撤销掉，重新放回到工作区：

    ```
    git reset HEAD <file>
    ```

    场景1：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令`git checkout -- file`。

    场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令`git reset HEAD <file>`，就回到了场景1，第二步按场景1操作。

    场景3：已经提交了不合适的修改到版本库时，想要撤销本次提交，参考[版本回退](https://www.liaoxuefeng.com/wiki/896043488029600/897013573512192)一节，不过前提是没有推送到远程库。

11. 要从版本库中删除该文件，那就用命令`git rm`删掉，并且`git commit`：

    ```
    $ git rm test.txt
    rm 'test.txt'
    
    $ git commit -m "remove test.txt"
    [master d46f35e] remove test.txt
     1 file changed, 1 deletion(-)
     delete mode 100644 test.txt
    ```

------

二、远程仓库
 -----

1.ssh key ：
---

本地git仓库和远程github仓库之间的传输是通过ssh加密的，所以，需要设置：

（1）创建SSH Key。在用户主目录下，看看有没有.ssh目录，如果有，再看看这个目录下有没有`id_rsa`和`id_rsa.pub`这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开Shell（Windows下打开Git Bash），创建SSH Key：

```
ssh-keygen -t rsa -C "youremail@example.com"
```

一路回车完成后，可以在用户主目录里找到`.ssh`目录，里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。

（2）登陆GitHub，打开“Account settings”，“SSH Keys”页面，点“Add SSH Key”，填上任意Title，在Key文本框里粘贴`id_rsa.pub`文件的内容。

最初创建ssh key 是使用某邮箱的，后续可以更改邮箱。也可以基于项目更改邮箱，可以设置：

```
// 在根目录，查看全局邮箱 
git config --global user.email  
// 在根目录，设置全局新邮箱 
git config --global user.email 'lalala@test.com' 
// 在某项目路径下，设置邮箱 
git config user.email 'lalala@test.com' 
```

2.新建远程仓库，将本地仓库与之关联
---

GitHub新建一个空仓库，得到仓库地址。本地已有项目需关联到该仓库。

```
git remote add origin git@github.com:monkey-yu/learngit.git
```

添加后，远程库的名字就是`origin`，这是Git默认的叫法，也可以改成别的，但是`origin`这个名字一看就知道是远程库。

下一步，就可以把本地库的所有内容推送到远程库上：

```
git push -u origin master
```

我们第一次推送`master`分支时，加上了`-u`参数，Git不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令。

从现在起，只要本地作了提交，就可以通过命令：

```
$ git push origin master
```

把本地`master`分支的最新修改推送至GitHub，现在，你就拥有了真正的分布式版本库！

------

分支管理
 -----

查看分支：`git branch`

创建分支：`git branch <name>`

切换分支：`git checkout <name>`

创建+切换分支：`git checkout -b <name>`

合并某分支到当前分支：`git merge <name>`

删除分支：`git branch -d <name>`

查看分支合并图： `git log --graph`

合并分支时，加上`--no-ff`参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，而`fast forward`合并就看不出来曾经做过合并。

任务没完成不想提交，将现在工作区的变化储藏起来，使用`git stash`;

恢复之前储藏的代码，2种命令：

一是用`git stash apply`恢复，但是恢复后，stash内容并不删除，你需要用`git stash drop`来删除；

二是用`git stash pop`，恢复的同时把stash内容也删了。

如果储藏空间有多个stash,可以使用`git stash list`查看，然后恢复指定的stash，用命令：

```
 git stash apply stash@{0}
```

创建远程`origin`的`dev`分支到本地:

```
git checkout -b dev origin/dev
```

**多人协作，尽量使用rebase，不要使用merge:**

在我的开发分支dev_zhao,修改代码后：

```
git add .  git commit -m '' 
```

然后切换到develop分支：

```
git checkout develop git pull origin develop 
```

然后切回我的开发分支：

```
git checkout dev_zhao git rebase develop 
```

如果此时有冲突，则解决冲突：

```
git add . git rebase --continue 
```

然后就可以重启服务了npm run dev 

如果没有冲突,在我的开发分支上：

```
git push 
```

------

标签管理
 -----

打一个新标签：`git tag <name>`

默认标签是打在最新提交的commit上的。有时候，如果忘了打标签，找到历史提交的commit id，比如f52c633敲入命令：

```
git tag v0.9 f52c633
```

 注意：标签总是和某个commit挂钩。如果这个commit既出现在master分支，又出现在dev分支，那么在这两个分支上都可以看到这个标签。

- 命令`git tag <tagname>`用于新建一个标签，默认为`HEAD`，也可以指定一个commit id；
- 命令`git tag -a <tagname> -m "blablabla..."`可以指定标签信息；
- 命令`git tag`可以查看所有标签。

- 命令`git push origin <tagname>`可以推送一个本地标签；
- 命令`git push origin --tags`可以推送全部未推送过的本地标签；
- 命令`git tag -d <tagname>`可以删除一个本地标签；
- 命令`git push origin :refs/tags/<tagname>`可以删除一个远程标签。

------

> end！

