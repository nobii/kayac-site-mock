import $ from 'jquery';
import _ from 'lodash';

const $root = $('.js-member-root');
const $more = $('.js-more');

const render = _.template($('#template-member').html());

let currentPage = 0;

function loadMore () {
    currentPage++;
    $.ajax(`/api/member.${currentPage}.json`)
        .done((json) => {
            _.each(json, (member) => {
                $root.append(render(member));
            });
        })
        .fail((err) => {
            $more.hide();
            alert('こちらが最後のページです。');
        });
}

$more.on('click', (e) => {
    e.preventDefault();
    loadMore();
});

loadMore();
