import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        show: Boolean,
    },
    watch: {
        show(val) {
            this.isCollapsed = val;
        },
        $route() {
            this.currentHighlight();
        },
    },
})

export default class SideMenu extends Vue {
    current = '1';
    openNames = [];

    isCollapsed = this.show;

    menuRelation = [
        {
            project: 'ecs-seabed',
            name: '2-1',
            relation: ['2'],
            url: '/ecs-seabed',
        },
        {
            project: 'ecs-reef',
            name: '2-2',
            relation: ['2'],
            url: '/ecs-reef',
        },
        {
            project: 'ecs-image',
            name: '2-3',
            relation: ['2'],
            url: '/ecs-image',
        },
        {
            project: 'spray-warehouse',
            name: '3-1-1',
            relation: ['3-1', '3'],
            url: '/spray-warehouse',
        },
        {
            project: 'spray-namespace',
            name: '3-1-2',
            relation: ['3-1', '3'],
            url: '/spray-namespace',
        },
        {
            project: 'spray-service-list',
            name: '3-2-1',
            relation: ['3-2', '3'],
            url: '/spray-service-list',
        },
        {
            project: 'spray-alga',
            name: '3-2-2',
            relation: ['3-2', '3'],
            url: '/spray-alga',
        },
        {
            project: 'spray-seahare',
            name: '3-2-2',
            relation: ['3-2', '3'],
            url: '/spray-seahare',
        },
        {
            project: 'spray-trepang',
            name: '3-2-2',
            relation: ['3-2', '3'],
            url: '/spray-trepang',
        },
        {
            project: 'spray-echinus',
            name: '3-2-2',
            relation: ['3-2', '3'],
            url: '/spray-echinus',
        },
        {
            project: 'spray-kafka',
            name: '3-2-2',
            relation: ['3-2', '3'],
            url: '/spray-kafka',
        },
        {
            project: 'spray-rabbit',
            name: '3-2-2',
            relation: ['3-2', '3'],
            url: '/spray-rabbit',
        },
        {
            project: 'ecs-alga',
            name: '4-1',
            relation: ['4'],
            url: '/ecs-alga',
        },
        {
            project: 'ecs-seahare',
            name: '4-2',
            relation: ['4'],
            url: '/ecs-seahare',
        },
        {
            project: 'ecs-trepang',
            name: '4-3',
            relation: ['4'],
            url: '/ecs-trepang',
        },
        {
            project: 'ecs-rabbit',
            name: '5-1',
            relation: ['5'],
            url: '/ecs-rabbit',
        },
        {
            project: 'dawn',
            name: '6-1',
            relation: ['6'],
            url: '/dawn',
        },
        {
            project: 'coral',
            name: '7',
            relation: [],
            url: '/coral',
        },
    ]

    get menuitemClasses() {
        return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : '',
        ];
    }

    currentHighlight() {
        const base = process.env.BASE_URL.replace(/\/$/, '');
        const re = new RegExp(`^${base}(/.*|$)`);
        const pathname = window.location.pathname.replace(re, '$1');
        const currentMenu = this.menuRelation.find(value => pathname.search(value.project) > -1);
        if (currentMenu) {
            this.current = currentMenu.name;
            this.openNames = this.openNames.concat(currentMenu.relation);
        } else if (!currentMenu) {
            this.current = '1';
            this.openNames = [];
        }
    }

    pageTurn(name) {
        const targetPage = this.menuRelation.find(item => name === item.name);
        if (targetPage) {
            this.$router.push(`${targetPage.url}`);
        } else {
            this.$router.push('/');
        }
    }

    created() {
        this.currentHighlight();
    }
}
