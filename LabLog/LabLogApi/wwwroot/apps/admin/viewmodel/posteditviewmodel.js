define(['ko', 'llapi', 'postModel'],
    function (ko, llapi, postModel) {
        return function postEditViewModel() {
            var self = this;
            self.llapi = llapi;
            self.postModel = ko.observable(new postModel());

            self.onSubmitPostClicked = function() {
                if (self.postModel().id() == null)
                {
                    self.llapi.createPost(self.postModel().getDto(), self.onPostEditSuccess, self.onPostEditError);
                }
                else
                {
                    self.llapi.updatePost(self.postModel().getDto(), self.onPostEditSuccess, self.onPostEditError);
                }
            };

            self.onPostEditSuccess = function (result) {
                self.postModel().loadFromJson(result);  
            };

            self.onPostEditError = function (message) {
                
            };
        };
    });