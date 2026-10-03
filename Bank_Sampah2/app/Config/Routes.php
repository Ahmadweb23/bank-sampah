<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');
$routes->get('api', 'Api::index');
$routes->post('api', 'Api::index');
$routes->options('api', 'Api::options');
