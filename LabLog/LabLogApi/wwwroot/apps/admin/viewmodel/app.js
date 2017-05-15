define(['sessionService', 'llapi', 'navState', 'fileUploadViewModel', 'postEditViewModel', 'homeViewModel', 'appState'],
    function (sessionService, llapi, navState, fileUploadViewModel, postEditViewModel, homeViewModel, appState) {
        return function app() {
            var self = this;

            self.sessionService = sessionService;
            self.navState = navState;
            self.appState = appState;
            self.homeViewModel = homeViewModel;

            self.tinymceIntialized = false;

            self.activate = function () {
                self.sessionService.initialize();
                self.fileUploadViewModel = new fileUploadViewModel();
                self.postEditViewModel = new postEditViewModel();
                self.navState.activePost.subscribe(self.onActivePostChanged);
                self.navState.activeTab.subscribe(self.onActiveTabChanged);
            };

            self.setNavigationTab = function (newTab) {
                self.navState.activeTab(newTab);                
            };

            self.onActivePostChanged = function () {
                self.postEditViewModel.loadPost(self.navState.activePost());
            };

            self.onActiveTabChanged = function () {
                if (!self.tinymceIntialized && self.navState.activeTab() === self.navState.tabs.postEditor) {
                    tinymce.init({
                        selector: '#llAdminPostBodyInput',
                        height: 500,
                        theme: 'modern',
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                            'searchreplace wordcount visualblocks visualchars code fullscreen',
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
                        ],
                        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
                        image_advtab: true,
                        templates: [
                            { title: 'Test template 1', content: 'Test 1' },
                            { title: 'Test template 2', content: 'Test 2' }
                        ],
                        content_css: [
                            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                            '//www.tinymce.com/css/codepen.min.css'
                        ],
                        //relative_urls: false,
                        remove_script_host: false,
                        convert_urls: false,
                        init_instance_callback: self.onTinyMceInitialized
                    });
                }
            };

            self.onTinyMceInitialized = function () {
                self.postEditViewModel.onTinyMceInitialized();
            };

            self.signInClick = function () {
                sessionService.initializeGoogleLogin();
                sessionService.initializeOfflineAccess();
            };

            self.signOutClick = function () {
                sessionService.disconnectFromGoogleSession();
            };
        };
});