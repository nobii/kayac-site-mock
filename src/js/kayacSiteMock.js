import $ from 'jquery';
import _ from 'lodash';

const ACTIVE_CLASS_NAME = 'is-active';


(function setupMemberPage() {
    const $menu = $('.js-menu-member');
    const $memberRoot = $('.js-member-root');
    const $more = $('.js-more');

    if (!$memberRoot.length) {
        return;
    }

    $menu.addClass(ACTIVE_CLASS_NAME);

    const renderMember = _.template($('#template-member').html());

    let currentMemberPage = 0;

    function loadMember () {
        currentMemberPage++;
        $.ajax(`/api/member.${currentMemberPage}.json`)
            .done((json) => {
                _.each(json, (member) => {
                    $memberRoot.append(renderMember(member));
                });
            })
            .fail((err) => {
                $more.hide();
                alert('こちらが最後のページです。');
            });
    }

    $more.on('click', (e) => {
        e.preventDefault();
        loadMember();
    });

    loadMember();
})();
