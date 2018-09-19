# 发布脚本

未完成，先记录在本文档手工执行

``` bash
# nginx:/etc/nginx
# password
hwl@123

# 开发机
## http://10.1.13.86/console/
ssh haoweilai@10.1.13.86

## 1. 开发机先清除
cd ~/webapp
rm -rf console-static

## 2. 本机再部署，部署完后清理
scp -r dist haoweilai@10.1.13.86:~/webapp/console-static


# 测试机
## http://zhiyucloudtest.facethink.com/console/
ssh ubuntu@221.122.65.168

## 1. 测试机先清除
cd ~/webapp
rm -rf console-static

## 2. 本机再部署，部署完后清理
scp -r dist ubuntu@221.122.65.168:~/webapp/console-static

## 方法二
### 使用跳板机，参考生产机上线，从跳板机向测试服务器拷贝的命令如下
scp -r ./console-static ubuntu@10.19.0.10:~/webapp/console-static


# 跳板机拷贝
ssh haoweilai@221.122.128.1 -p 22022
cd ~/zhiyucloud-fe
rm -rf console-static
scp -r -P 22022 dist haoweilai@221.122.128.1:~/zhiyucloud-fe/console-static


# 生产机
ssh haoweilai@10.19.250.69

## 1. 生产机先清除
cd ~/webapp/console-static
rm -rf console-static

## 2. 跳板机再部署，部署完后清理
scp -r ./console-static haoweilai@10.19.250.69:~/webapp/console-static
rm -rf console-static
```
