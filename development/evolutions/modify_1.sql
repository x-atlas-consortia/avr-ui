ALTER TABLE "public"."antibodies"
ADD senescence_specific text NOT NULL DEFAULT '',
ADD cell_marker text NOT NULL DEFAULT '',
ADD segmentation_cell_membrane text NOT NULL DEFAULT '',
ADD taxon text NOT NULL DEFAULT '',
ADD recommended text NOT NULL DEFAULT '';