<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xul="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
    <xsl:output method="xml" indent="yes" encoding="ISO-8859-1"/>
    <xsl:template match="/">
        <xul:tabbox>
            <xul:tabs>
                <xsl:apply-templates select="//li[@role='tab']"/>
            </xul:tabs>
            <xul:tabpanels>
                <xsl:apply-templates select="//li[@role='tabpanel']"/>
            </xul:tabpanels>
        </xul:tabbox>
    </xsl:template>
    <xsl:template match="li[@role='tab']">
        <xul:tab>
            <xsl:attribute name="id">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:value-of select="."/>
        </xul:tab>
    </xsl:template>
    <xsl:template match="li[@role='tabpanel']">
        <xul:tabpanel>
            <xsl:attribute name="id">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:value-of select="."/>
        </xul:tabpanel>
    </xsl:template>
</xsl:stylesheet>