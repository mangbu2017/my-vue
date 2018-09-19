import Vue from 'vue';
import Router from 'vue-router';
import identity from './apps/identity/router';
import ecsSeabedRouter from './apps/ecs-seabed/router';
import ecsSeahareRouter from './apps/ecs-seahare/router';
import ecsTrepangRouter from './apps/ecs-trepang/router';
import ecsAlgaRouter from './apps/ecs-alga/router';
import overviewRouter from './apps/overview/router';
import sprayWarehouseRouter from './apps/spray-warehouse/router';
import sprayNamespaceRouter from './apps/spray-namespace/router';
import sprayServiceListRouter from './apps/spray-service-list/router';
import spraySeahareRouter from './apps/spray-seahare/router';
import sprayTrepangRouter from './apps/spray-trepang/router';
import sprayKafkaRouter from './apps/spray-kafka/router';
import sprayEchinusRouter from './apps/spray-echinus/router';
import sprayRabbitRouter from './apps/spray-rabbit/router';
import sprayAlgaRouter from './apps/spray-alga/router';
import coralRouter from './apps/coral/router';
import dawnRouter from './apps/dawn/router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        overviewRouter,

        ...identity,

        ecsSeabedRouter,
        ecsSeahareRouter,
        ecsTrepangRouter,
        ecsAlgaRouter,
        sprayWarehouseRouter,
        sprayNamespaceRouter,
        sprayServiceListRouter,
        spraySeahareRouter,
        sprayTrepangRouter,
        sprayKafkaRouter,
        sprayEchinusRouter,
        sprayRabbitRouter,
        sprayAlgaRouter,
        coralRouter,
        dawnRouter,
    ],
});
