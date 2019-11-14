import 'package:campus_mobile_experimental/core/services/availability_service.dart';
import 'package:campus_mobile_experimental/core/services/bottom_navigation_bar_service.dart';
import 'package:campus_mobile_experimental/core/services/event_service.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';

List<SingleChildCloneableWidget> changeNotifierProviders = [
  ChangeNotifierProvider<BottomNavigationBarProvider>(
    builder: (BuildContext context) => BottomNavigationBarProvider(),
  ),
  ChangeNotifierProvider<AvailabilityService>(
    builder: (context) => AvailabilityService(),
  ),
  ChangeNotifierProvider<EventsService>(
    builder: (context) => EventsService(),
  ),
];
