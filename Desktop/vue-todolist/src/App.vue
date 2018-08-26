<template>
    <div class="todolist">
        <div class="todo-header">
            <div class="header-content">
                <h1>VUE-todoList</h1>
            </div>
        </div>
        <div class="todo-main">
            <div class="main-input">
                <input type="text" class="todo-input" v-model="inputValue"
                @keyup.enter="addItem">
                <div class="todo-btn" @click="addItem">添加任务</div>
            </div>
            <ul class="main-type">
                <li class="untaskcount">当前还有 {{filterList}} 个任务未完成</li>
                <li class="tasktypes">
                    <a href="#unfinished">未完成任务</a>
                    <a href="#finished">完成任务</a>
                    <a href="#all">所有任务</a>
                </li>
            </ul>
            <h3 class="list-title">任务列表:</h3>
            <div class="main-list">
                <h1 class="notask" v-show="!list.length">当前无任务</h1>
                <ul class="todo-list">
                    <li class="item" v-for="(item, index) in filterCheck" :key="index" :class="{completed:item.checked, editing:isEditing === item}">
                        <div class="content">
                            <input type="checkbox" class="check" v-model="item.checked">
                            <label @dblclick="editItem(item)">{{item.content}}</label>
                            <button class="delete" @click="deleteItem(item)">X</button>
                        </div>
                        <input type="text" class="edit" :class="{hide: isEditing !== item}" v-focus="isEditing === item" v-model="item.content" @keyup.enter="edited" @blur="edited" @keyup.esc="cancelEdit(item)">
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    var myLocalStorage = {
        save(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get(key) {
            return JSON.parse(localStorage.getItem(key));
        }
    }

    export default {
        data() {
            return {
                list: [],
                inputValue: '',
                isEditing: '',
                beforeEditing: '',
                view: 'all',
            }
        },
        watch: {
            list: {
                deep: true,
                handler: function() {
                    myLocalStorage.save('todolist', this.list);
                }
            },
        },
        methods: {
            addItem() {
                this.list.push({
                    content: this.inputValue,
                    checked: false
                })
                this.inputValue = "";
            },
            deleteItem(item) {
                var index = this.list.indexOf(item);
                this.list.splice(index, 1);
            },
            editItem(item) {
                console.log(item);
                this.isEditing = item;
                this.beforeEditing = item.content;
            },
            edited() {
                this.isEditing = "";
            },
            cancelEdit(todo) {
                todo.content = this.beforeEditing;
                this.beforeEditing = '';
                this.isEditing = '';
            }
        },
        directives: {
            focus: {
                update(el, binding) {
                    if(binding.value == true) {
                        el.focus();
                    }
                }
            }
        },
        computed: {
            filterList() {
                return this.list.filter(function(item){return !item.checked}).length;
            },
            filterCheck() {
                switch(this.view) {
                    case 'all': 
                        return this.list;
                    case 'finished': 
                        return this.list.filter(function(item) {
                            return item.checked;
                        });
                    case 'unfinished':
                        return this.list.filter(function(item) {
                            return !item.checked;
                        });
                }
            }
        },
        beforeCreate() {
            window.addEventListener('hashchange', () => {
                var hash = window.location.hash.slice(1);
                this.view = hash;
            });
        },
        created() {
            this.list = myLocalStorage.get('todolist') || [];
        }
    }
</script>
<style lang="less">
    * {
        padding: 0;
        margin: 0;
        list-style: none;
        text-decoration: none;
    }

    .btn() {
        width: 75px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 10px;
        color: white;
        background-color: #09c;
    }

    .clear() {
        &:after {
            display: block;
            content: '';
            clear: both;
        }
    }

    .todolist {
        width: 600px;
        height: 600px;
        margin: 100px auto 0 auto;
        border-radius: 50px 50px;
        background-color: #9cc;
        .todo-header {
            width: 100%;
            height: 100px;
            .header-content {
                height: 100px;
                line-height: 100px;
                text-align: center;
            }
        }
        .todo-main {
            width: 100%;
            height: 400px;
            .main-input {
                display: flex;
                justify-content: space-between;
                .todo-input {
                    width: 60%;
                    height: 30px;
                    padding: 0 15px;
                    margin-left: 30px;
                    border-radius: 20px;
                    border-width: 0px;
                    outline: none;
                }
                .todo-btn {
                    .btn;
                    margin-right: 100px;
                }
            }
            .main-type {
                .untaskcount {
                    height: 30px;
                    line-height: 30px;
                    margin-left: 40px;
                }
                .tasktypes {
                    .clear;
                    a {
                        .btn;
                        float: right;
                        margin-right: 10px;
                    }
                }
            }
            .list-title {
                height: 30px;
                line-height: 30px;
                margin-left: 40px;
            }
            .main-list {
                .notask {
                    margin: 100px;
                    text-align: center;
                }
                .todo-list {
                    .item {
                        &.completed {
                            opacity: .3;
                            label {
                                text-decoration-line: line-through;
                            }
                        }

                        &.editing .content{
                            display: none;
                        }

                        .content {
                            height: 35px;
                            margin: 0 50px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            label {
                                width: 450px;
                            }
                            .delete {
                                width: 25px;
                            }
                        }
                        .edit {
                            height: 30px;
                            width: 300px;
                            margin-left: 60px;
                            padding: 0 10px;
                            outline: none;
                            border-width: 0px;
                            border-radius: 10px;

                            &.hide {
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
    
