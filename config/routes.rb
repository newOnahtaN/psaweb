Rails.application.routes.draw do

  root 'application#index'
  get 'MasterList', to: 'master_list#index'

end
