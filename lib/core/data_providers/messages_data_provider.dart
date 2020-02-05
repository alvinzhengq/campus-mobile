import 'package:campus_mobile_experimental/core/data_providers/user_data_provider.dart';
import 'package:campus_mobile_experimental/core/models/message_model.dart';
import 'package:flutter/material.dart';
import 'package:campus_mobile_experimental/core/services/message_service.dart';

class MessagesDataProvider extends ChangeNotifier {
  MessagesDataProvider() {
    /// DEFAULT STATES
    _isLoading = false;
    _messages = List<MessageElement>();

    /// TODO: initialize services here
    _messageService = MessageService();
  }

  /// STATES
  /// TODO: create any other states needed for the feature
  bool _isLoading;
  DateTime _lastUpdated;
  String _error;

  /// MODELS
  /// TODO: add models that will be needed in this data provider
  List<MessageElement> _messages;
  //List<Message> _privateMessages;
  UserDataProvider _userDataProvider;

  /// DATA PROVIDERS
  /// TODO: add data providers that will be needed if this is a dependent data provider
  /// create setters for each of these providers

  /// SERVICES
  /// TODO: split fetchMessages() into fetchPrivateMessages() and fetchPublicMessages()
  /// if functionality is split in the API
  MessageService _messageService;

  //Fetch messages
  void fetchMessages() async {
    _isLoading = true;
    _error = null;

    int timestamp = 0;
    int returnedTimestamp = 1;

    notifyListeners();

    if(_userDataProvider.isLoggedIn){
      while(true){
        if(await _messageService.fetchMyMessagesData(timestamp)){
          returnedTimestamp = _messageService.messagingModels.messages[_messageService.messagingModels.messages.length - 1].timestamp;
          print(returnedTimestamp);
          if(timestamp != returnedTimestamp){
            _messages.addAll(_messageService.messagingModels.messages);
            _lastUpdated = DateTime.now();
            timestamp = returnedTimestamp;
          }
          else{
            break;
          }
        }
        else{
          _error = _messageService.error;
          break;
        }
      }
    }
    else{
      while(true){
        if(await _messageService.fetchTopicData(timestamp)){
          returnedTimestamp = _messageService.messagingModels.messages[_messageService.messagingModels.messages.length - 1].timestamp;
          print(returnedTimestamp);
          if(timestamp != returnedTimestamp){
            _messages.addAll(_messageService.messagingModels.messages);
            _lastUpdated = DateTime.now();
            timestamp = returnedTimestamp;
          }
          else{
            break;
          }
        }
        else{
          _error = _messageService.error;
          break;
        }
      }
    }

    _isLoading = false;
    notifyListeners();
  }

  //TODO: Need to fix ordering of messages, dependent on API feedback
  List<MessageElement>makeOrderedMessagesList(){
    List<MessageElement>temp = List<MessageElement>();
    temp = _messages;
    temp.sort((a,b) => b.timestamp.compareTo(a.timestamp));
    _messages = temp;
    return _messages;
  }

  ///This setter is only used in provider to supply and updated UserDataProvider object
  set userDataProvider(UserDataProvider value) {
    _userDataProvider = value;
  }

  /// SIMPLE GETTERS
  bool get isLoading => _isLoading;
  String get error => _error;
  DateTime get lastUpdated => _lastUpdated;

  List<MessageElement> get messages {
    if (_messages != null) {
      ///check if we have an offline _userProfileModel
      /*if (_userDataProvider.userProfileModel != null) {
        //Return private and public messages in chronological order here
        //Make new method for makeOrderedList
        return makeOrderedMessagesList();
      }*/
      return makeOrderedMessagesList();
    }
    return List<MessageElement>();
  }
  
}