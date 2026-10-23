'use client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  SearchDialogFooter,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { create } from '@orama/orama';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import styles from '@/app/docs/docs.module.css';

function initOrama() {
  return create({
    schema: { _: 'string' },
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: 'english',
  });
}

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n(); // (optional) for i18n
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    initOrama,
    locale,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay className={styles.searchOverlay} />
      <SearchDialogContent className={styles.searchDialog}>
        <SearchDialogHeader className={styles.searchHeader}>
          <SearchDialogIcon />
          <SearchDialogInput placeholder="Search the Panasaurus docs…" aria-label="Search the Panasaurus docs" />
          <SearchDialogClose aria-label="Close search" />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
        <SearchDialogFooter className={styles.searchFooter}>
          <span>Panasaurus documentation</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open</span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
