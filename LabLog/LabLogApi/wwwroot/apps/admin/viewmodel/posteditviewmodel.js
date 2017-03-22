define(['ko', 'llapi', 'postModel'],
    function (ko, llapi, postModel) {
        return function postEditViewModel() {
            var self = this;
            self.llapi = llapi;
            self.postModel = ko.observable(new postModel());
            self.newTagText = ko.observable();
            self.selectedTags = ko.observableArray();
            self.images = ko.observableArray();
            self.selectedImage = ko.observable();

            self.onLoadImagesClicked = function () {
                self.llapi.getImages(self.onLoadImagesSuccess, self.onError);
            };

            self.onLoadImagesSuccess = function (result) {
                self.images(result);
            };

            self.onAddImageClicked = function () {
                self.postModel().body(self.postModel().body() + "<img class='llPostBodyImage' src='/images/userimages/" + self.selectedImage() + "'/>");
            };

            self.onAddTagClicked = function () {
                if (self.newTagText() != null && self.newTagText != "")
                    self.postModel().tags.push(self.newTagText());
                self.newTagText("");
            };

            self.onLoadFromIdClicked = function () {
                self.llapi.getPostById(self.postModel().id(), self.onLoadFromIdSuccess, self.onError);
            };

            self.onLoadFromIdSuccess = function (result) {
                self.postModel().loadFromObject(result);
            };

            self.onRemoveTagClicked = function () {
                if (self.selectedTags() != null && self.selectedTags().length > 0)
                {
                    var tags = self.selectedTags().slice();
                    for (var i = 0; i < tags.length; i++) {
                        self.postModel().tags.remove(tags[i]);
                    }
                }
            };

            self.onSubmitPostClicked = function() {
                if (self.postModel().id() == null || self.postModel().id() == "")
                {
                    self.llapi.createPost(self.postModel().getDto(), self.onPostEditSuccess, self.onError);
                }
                else
                {
                    self.llapi.updatePost(self.postModel().getDto(), self.onPostEditSuccess, self.onError);
                }
            };

            self.onPostEditSuccess = function (result) {
                self.postModel().loadFromObject(result);
            };

            self.onError = function (message) {
                alert("Error : " + messsage);
            };
        };
    });